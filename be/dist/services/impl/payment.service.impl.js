"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = __importDefault(require("../../models/orders"));
const payment_1 = __importDefault(require("../../models/payment"));
const bakong_client_1 = __importDefault(require("../../clients/bakong.client"));
const mongoose_1 = __importDefault(require("mongoose"));
const toResponse_1 = require("../../mapper/toResponse");
class PaymentServiceImpl {
    constructor() {
        this.paymentModel = payment_1.default.getModel();
    }
    createPayment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield orders_1.default.getModel().findById(data.orderId);
            if (!order) {
                throw new Error("Order not found.");
            }
            // Generate KHQR using SDK
            const { qr, md5 } = bakong_client_1.default.generateMerchantKHQR({
                amount: data.amount,
                currency: data.currency,
                billNumber: data.orderId,
            });
            //Set expiration date if provided
            const expiresAt = data.expiesAt || new Date(Date.now() + 15 * 60 * 1000);
            // Create payment record
            const payment = yield this.paymentModel.create({
                orderId: new mongoose_1.default.Types.ObjectId(data.orderId),
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
        });
    }
    getPaymentById(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.paymentModel.findById(paymentId);
            if (!payment)
                throw new Error("Payment not found.");
            return payment;
        });
    }
    getPaymentByOrderId(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield orders_1.default.getModel().findById(orderId);
            if (!order) {
                throw new Error("Order not found.");
            }
            const payment = yield this.paymentModel.findOne({ orderId: order._id });
            if (!payment) {
                return null;
            }
            return toResponse_1.PaymentResponseMapper.toResponse(payment);
        });
    }
    getAllPayments(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const allPayments = yield this.paymentModel.find();
            return allPayments.map((payment) => toResponse_1.PaymentResponseMapper.toResponse(payment));
        });
    }
    updatePaymentStatus(paymentId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.paymentModel.findById(paymentId);
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
            yield payment.save();
            return toResponse_1.PaymentResponseMapper.toResponse(payment);
        });
    }
    generateKHQR(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield orders_1.default.getModel().findById(data.orderId);
            if (!order)
                throw new Error("Order not found.");
            const { qr } = bakong_client_1.default.generateMerchantKHQR({
                amount: data.amount,
                currency: data.currency,
                billNumber: data.orderId,
            });
            return qr;
        });
    }
    verifyPayment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // First verify the KHQR string format is valid
                const verificationResult = bakong_client_1.default.verifyKHQR(data.khqrString);
                if (!verificationResult.isValid) {
                    console.log("KHQR format is invalid");
                    return false;
                }
                // Find the payment by order ID
                const order = yield orders_1.default.getModel().findById(data.orderId);
                if (!order) {
                    throw new Error("Order not found.");
                }
                const payment = yield this.paymentModel.findOne({ orderId: order._id });
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
                    yield this.expirePayment(payment._id.toString());
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
                    yield payment.save();
                    console.log("Payment verified and marked as PENDING");
                }
                console.log(" Payment verified successfully");
                return true;
            }
            catch (error) {
                console.error("Error verifying payment:", error);
                throw new Error(`Failed to verify payment: ${error.message}`);
            }
        });
    }
    completePayment(paymentId, transactionRef) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.paymentModel.findById(paymentId);
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
            yield payment.save();
            console.log("Payment completed successfully:", paymentId);
            return toResponse_1.PaymentResponseMapper.toResponse(payment);
        });
    }
    failPayment(paymentId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.paymentModel.findById(paymentId);
            if (!payment) {
                throw new Error("Payment not found.");
            }
            if (payment.status === "COMPLETED") {
                throw new Error("Cannot fail a completed payment.");
            }
            if (payment.status === "FAILED") {
                console.log("Payment already marked as failed");
                return toResponse_1.PaymentResponseMapper.toResponse(payment);
            }
            payment.status = "FAILED";
            yield payment.save();
            console.log("Payment marked as failed:", paymentId, reason ? `Reason: ${reason}` : "");
            return toResponse_1.PaymentResponseMapper.toResponse(payment);
        });
    }
    expirePayment(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.paymentModel.findById(paymentId);
            if (!payment) {
                throw new Error("Payment not found.");
            }
            if (payment.status === "COMPLETED") {
                throw new Error("Cannot expire a completed payment.");
            }
            if (payment.status === "EXPIRED") {
                console.log("Payment already expired");
                return toResponse_1.PaymentResponseMapper.toResponse(payment);
            }
            payment.status = "EXPIRED";
            yield payment.save();
            console.log("Payment marked as expired:", paymentId);
            return toResponse_1.PaymentResponseMapper.toResponse(payment);
        });
    }
    checkExpiredPayments() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const expiredPayments = yield this.paymentModel.find({
                status: { $in: ["CREATED", "PENDING"] },
                expiresAt: { $lte: now },
            });
            console.log(`Found ${expiredPayments.length} expired payments`);
            for (const payment of expiredPayments) {
                payment.status = "EXPIRED";
                yield payment.save();
                console.log("Auto-expired payment:", payment._id.toString());
            }
            console.log("Expired payments check completed");
        });
    }
}
exports.default = new PaymentServiceImpl();
