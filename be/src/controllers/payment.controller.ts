import paymentService from "@services/impl/payment.service.impl";
import { Request, Response } from "express";

class PaymentController {
  // Create new payment
  createPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const payment = await paymentService.createPayment(req.body);
      res.status(201).json({
        success: true,
        message: "Payment successfully",
        data: payment,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  // Get payment by ID
  getPaymentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const payment = await paymentService.getPaymentById(req.params.paymentId);
      if (!payment) {
        res.status(404).json({
          success: false,
          message: "Payment not found. ",
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  // Get payment by order ID
  getPaymentByOrderId = async (req: Request, res: Response): Promise<void> => {
    try {
      const payment = await paymentService.getPaymentByOrderId(
        req.params.orderId
      );
      if (!payment) {
        res.status(404).json({
          success: false,
          message: "Payment not found for this order",
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  // Get all payments with filters
  getAllPayments = async (req: Request, res: Response): Promise<void> => {
    try {
      const payments = await paymentService.getAllPayments(req.query);
      res.status(200).json({
        success: true,
        data: payments,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  // Update payment status
  updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const payment = await paymentService.updatePaymentStatus(
        req.params.paymentId,
        req.body
      );
      if (!payment) {
        res.status(404).json({
          success: false,
          message: "Payment not found",
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Payment status updated successfully",
        data: payment,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  // Complete payment
  completePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { transactionRef } = req.body;
      const payment = await paymentService.completePayment(
        req.params.paymentId,
        transactionRef
      );
      if (!payment) {
        res.status(404).json({
          success: false,
          message: "Payment not found",
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Payment completed successfully",
        data: payment,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  // Fail payment
  failPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reason } = req.body;
      const payment = await paymentService.failPayment(
        req.params.paymentId,
        reason
      );
      if (!payment) {
        res.status(404).json({
          success: false,
          message: "Payment not found",
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Payment marked as failed",
        data: payment,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  // Expire payment
  expirePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const payment = await paymentService.expirePayment(req.params.paymentId);
      if (!payment) {
        res.status(404).json({
          success: false,
          message: "Payment not found",
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Payment marked as expired",
        data: payment,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  // Generate KHQR
  generateKHQR = async (req: Request, res: Response): Promise<void> => {
    try {
      const qrString = await paymentService.generateKHQR(req.body);
      res.status(200).json({
        success: true,
        data: { khqrString: qrString },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  // Verify payment
  verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const isVerified = await paymentService.verifyPayment(req.body);
      res.status(200).json({
        success: true,
        verified: isVerified,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  // Check expired payments (background job)
  checkExpiredPayments = async (req: Request, res: Response): Promise<void> => {
    try {
      await paymentService.checkExpiredPayments();
      res.status(200).json({
        success: true,
        message: "Expired payments checked and updated",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
}

export default new PaymentController();
