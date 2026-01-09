import {
  CreatePaymentDTO,
  PaymentResponseDTO,
  PaymentFilterDTO,
  UpdatePaymentStatusDTO,
  GenerateKHQRDTO,
  VerifyPaymentDTO,
} from "@dtos/request/payment.request";
import PaymentService from "@services/payment.service";
import OrderModel from "@models/orders";
import PaymentModel, { IPayment } from "@models/payment";
import bakongClient from "clients/bakong.client";
import mongoose from "mongoose";
import { PaymentResponseMapper } from "@mapper/toResponse";
import { threadCpuUsage } from "process";
import { BakongKHQR } from "bakong-khqr";

class PaymentServiceImpl implements PaymentService {
  private paymentModel = PaymentModel.getModel();

  async createPayment(data: CreatePaymentDTO): Promise<PaymentResponseDTO> {
    const order = await OrderModel.getModel().findById(data.orderId);
    if (!order) {
      throw new Error("Order not found.");
    }
    // Generate KHQR using SDK
    const { qr, md5 } = bakongClient.generateMerchantKHQR({
      amount: data.amount,
      currency: data.currency,
      billNumber: data.orderId,
    });

    //Set expiration date if provided
    const expiresAt = data.expiesAt || new Date(Date.now() + 15 * 60 * 1000);

    // Create payment record
    const payment = await this.paymentModel.create({
      orderId: new mongoose.Types.ObjectId(data.orderId),
      method: data.method,
      amount: data.amount,
      currency: data.currency,
      khqrString: qr,
      md5Hash: md5,
      status: "CREATED",
      expiresAt,
    });

    if (!payment) {
      throw new Error("Failed to create payment.");
    }

    return {
      id: payment._id.toString(),
      orderId: payment.orderId.toString(),
      method: payment.method,
      amount: payment.amount,
      currency: payment.currency,
      khqrString: payment.khqrString,
      md5Hash: payment.md5Hash,
      status: payment.status,
      paidAt: payment.paidAt,
      expiresAt: payment.expiresAt,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  async getPaymentById(paymentId: string): Promise<IPayment | null> {
    const payment = await this.paymentModel.findById(paymentId);
    if (!payment) throw new Error("Payment not found.");
    return payment;
  }

  async getPaymentByOrderId(
    orderId: string
  ): Promise<PaymentResponseDTO | null> {
    const order = await OrderModel.getModel().findById(orderId);
    if (!order) {
      throw new Error("Order not found.");
    }

    const payment = await this.paymentModel.findOne({ orderId: order._id });
    if (!payment) {
      return null;
    }

    return PaymentResponseMapper.toResponse(payment);
  }

  async getAllPayments(
    filter?: PaymentFilterDTO
  ): Promise<PaymentResponseDTO[]> {
    const allPayments = await this.paymentModel.find();
    return allPayments.map((payment) =>
      PaymentResponseMapper.toResponse(payment)
    );
  }

  async updatePaymentStatus(
    paymentId: string,
    data: UpdatePaymentStatusDTO
  ): Promise<PaymentResponseDTO | null> {
    const payment = await this.paymentModel.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found.");
    }

    // Check current payment status before updating
    if (payment.status === "COMPLETED") {
      throw new Error("Payment already completed.");
    }
    if (payment.status === "EXPIRED") {
      throw new Error("Payment already expired");
    }

    if (payment.status === "FAILED") {
      throw new Error("Failed payment cannot be updated");
    }

    if (data.status === "COMPLETED" && !data.transactionRef) {
      throw new Error("Transaction reference is required for completion.");
    }

    // Update payment status
    payment.status = data.status;
    if (data.transactionRef) {
      payment.transactionRef = data.transactionRef;
    }
    if (data.paidAt) {
      payment.paidAt = data.paidAt;
    }

    await payment.save();
    return PaymentResponseMapper.toResponse(payment);
  }

  async generateKHQR(data: GenerateKHQRDTO): Promise<string> {
    const order = await OrderModel.getModel().findById(data.orderId);
    if (!order) throw new Error("Order not found.");

    const { qr } = bakongClient.generateMerchantKHQR({
      amount: data.amount,
      currency: data.currency,
      billNumber: data.orderId,
    });

    return qr;
  }

  async verifyPayment(data: VerifyPaymentDTO): Promise<boolean> {
    try {
      // First verify the KHQR string format is valid
      const verificationResult = bakongClient.verifyKHQR(data.khqrString);

      if (!verificationResult.isValid) {
        console.log("KHQR format is invalid");
        return false;
      }

      // Find the payment by order ID
      const order = await OrderModel.getModel().findById(data.orderId);
      if (!order) {
        throw new Error("Order not found.");
      }

      const payment = await this.paymentModel.findOne({ orderId: order._id });
      if (!payment) {
        throw new Error("Payment not found for this order.");
      }

      // Verify the KHQR matches the stored one
      if (payment.khqrString !== data.khqrString) {
        console.log("KHQR string does not match stored payment");
        return false;
      }

      // Check if payment is already completed
      if (payment.status === "COMPLETED") {
        console.log("Payment already completed");
        return true; // Already verified and completed
      }

      // Check if payment has expired
      if (payment.expiresAt && new Date() > payment.expiresAt) {
        console.log("Payment has expired");
        await this.expirePayment(payment._id.toString());
        return false;
      }

      // Check if payment is in a valid state for verification
      if (payment.status === "FAILED" || payment.status === "EXPIRED") {
        console.log(" Payment is in invalid state:", payment.status);
        return false;
      }

      // If transactionRef is provided, update the payment
      if (data.transactionRef) {
        payment.transactionRef = data.transactionRef;
        payment.status = "PENDING";
        await payment.save();
        console.log("Payment verified and marked as PENDING");
      }

      console.log(" Payment verified successfully");
      return true;
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      throw new Error(`Failed to verify payment: ${error.message}`);
    }
  }
  async completePayment(
    paymentId: string,
    transactionRef: string
  ): Promise<PaymentResponseDTO | null> {
    const payment = await this.paymentModel.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found.");
    }

    if (payment.status === "COMPLETED") {
      throw new Error("Payment already completed.");
    }

    if (payment.status === "EXPIRED") {
      throw new Error("Cannot complete an expired payment.");
    }

    if (payment.status === "FAILED") {
      throw new Error("Cannot complete a failed payment.");
    }

    if (!transactionRef) {
      throw new Error("Transaction reference is required.");
    }

    payment.status = "COMPLETED";
    payment.transactionRef = transactionRef;
    payment.paidAt = new Date();

    await payment.save();
    console.log("Payment completed successfully:", paymentId);

    return PaymentResponseMapper.toResponse(payment);
  }

  async failPayment(
    paymentId: string,
    reason?: string
  ): Promise<PaymentResponseDTO | null> {
    const payment = await this.paymentModel.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found.");
    }

    if (payment.status === "COMPLETED") {
      throw new Error("Cannot fail a completed payment.");
    }

    if (payment.status === "FAILED") {
      console.log("Payment already marked as failed");
      return PaymentResponseMapper.toResponse(payment);
    }

    payment.status = "FAILED";

    await payment.save();
    console.log(
      "Payment marked as failed:",
      paymentId,
      reason ? `Reason: ${reason}` : ""
    );

    return PaymentResponseMapper.toResponse(payment);
  }

  async expirePayment(paymentId: string): Promise<PaymentResponseDTO | null> {
    const payment = await this.paymentModel.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found.");
    }

    if (payment.status === "COMPLETED") {
      throw new Error("Cannot expire a completed payment.");
    }

    if (payment.status === "EXPIRED") {
      console.log("Payment already expired");
      return PaymentResponseMapper.toResponse(payment);
    }

    payment.status = "EXPIRED";

    await payment.save();
    console.log("Payment marked as expired:", paymentId);

    return PaymentResponseMapper.toResponse(payment);
  }

  async checkExpiredPayments(): Promise<void> {
    const now = new Date();

    const expiredPayments = await this.paymentModel.find({
      status: { $in: ["CREATED", "PENDING"] },
      expiresAt: { $lte: now },
    });

    console.log(`Found ${expiredPayments.length} expired payments`);

    for (const payment of expiredPayments) {
      payment.status = "EXPIRED";
      await payment.save();
      console.log("Auto-expired payment:", payment._id.toString());
    }

    console.log("Expired payments check completed");
  }
}

export default new PaymentServiceImpl();
