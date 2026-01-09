"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = __importDefault(require("../controllers/payment.controller"));
const route = (0, express_1.Router)();
// Create new payment
route.post("/payment", payment_controller_1.default.createPayment);
// Get payment by ID
route.get("/payment/:paymentId", payment_controller_1.default.getPaymentById);
// Get payment by order ID
route.get("/payment/order/:orderId", payment_controller_1.default.getPaymentByOrderId);
// Get all payments (with optional filters)
route.get("/payment", payment_controller_1.default.getAllPayments);
// Update payment status
route.patch("/payment/:paymentId/status", payment_controller_1.default.updatePaymentStatus);
// Complete payment
route.post("/payment/:paymentId/complete", payment_controller_1.default.completePayment);
// Fail payment
route.post("/payment/:paymentId/fail", payment_controller_1.default.failPayment);
// Expire payment
route.post("/payment/:paymentId/expire", payment_controller_1.default.expirePayment);
// Generate KHQR only
route.post("/payment/generate-khqr", payment_controller_1.default.generateKHQR);
// Verify payment
route.post("/payment/verify", payment_controller_1.default.verifyPayment);
// Check expired payments (can be used as a cron job endpoint)
route.post("/payment/check-expired", payment_controller_1.default.checkExpiredPayments);
exports.default = route;
