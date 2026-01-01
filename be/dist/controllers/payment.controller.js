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
const payment_service_impl_1 = __importDefault(require("../services/impl/payment.service.impl"));
class PaymentController {
    constructor() {
        // Create new payment
        this.createPayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield payment_service_impl_1.default.createPayment(req.body);
                res.status(201).json({
                    success: true,
                    message: "Payment successfully",
                    data: payment,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Internal Server Error",
                });
            }
        });
        // Get payment by ID
        this.getPaymentById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield payment_service_impl_1.default.getPaymentById(req.params.paymentId);
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
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Internal Server Error",
                });
            }
        });
        // Get payment by order ID
        this.getPaymentByOrderId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield payment_service_impl_1.default.getPaymentByOrderId(req.params.orderId);
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
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Internal Server Error",
                });
            }
        });
        // Get all payments with filters
        this.getAllPayments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const payments = yield payment_service_impl_1.default.getAllPayments(req.query);
                res.status(200).json({
                    success: true,
                    data: payments,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Internal Server Error",
                });
            }
        });
        // Update payment status
        this.updatePaymentStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield payment_service_impl_1.default.updatePaymentStatus(req.params.paymentId, req.body);
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
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Internal Server Error",
                });
            }
        });
        // Complete payment
        this.completePayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { transactionRef } = req.body;
                const payment = yield payment_service_impl_1.default.completePayment(req.params.paymentId, transactionRef);
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
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Internal Server Error",
                });
            }
        });
        // Fail payment
        this.failPayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { reason } = req.body;
                const payment = yield payment_service_impl_1.default.failPayment(req.params.paymentId, reason);
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
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Internal Server Error",
                });
            }
        });
        // Expire payment
        this.expirePayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield payment_service_impl_1.default.expirePayment(req.params.paymentId);
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
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Internal Server Error",
                });
            }
        });
        // Generate KHQR
        this.generateKHQR = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const qrString = yield payment_service_impl_1.default.generateKHQR(req.body);
                res.status(200).json({
                    success: true,
                    data: { khqrString: qrString },
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Internal Server Error",
                });
            }
        });
        // Verify payment
        this.verifyPayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const isVerified = yield payment_service_impl_1.default.verifyPayment(req.body);
                res.status(200).json({
                    success: true,
                    verified: isVerified,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Internal Server Error",
                });
            }
        });
        // Check expired payments (background job)
        this.checkExpiredPayments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield payment_service_impl_1.default.checkExpiredPayments();
                res.status(200).json({
                    success: true,
                    message: "Expired payments checked and updated",
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Internal Server Error",
                });
            }
        });
    }
}
exports.default = new PaymentController();
