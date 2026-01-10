import { Router } from "express";
import paymentController from "@controllers/payment.controller";

const route = Router();

// Create new payment
route.post("/payment", paymentController.createPayment);

// Get payment by ID
route.get("/payment/:paymentId", paymentController.getPaymentById);

// Get payment by order ID
route.get("/payment/order/:orderId", paymentController.getPaymentByOrderId);

// Get all payments (with optional filters)
route.get("/payment", paymentController.getAllPayments);

// Update payment status
route.patch(
  "/payment/:paymentId/status",
  paymentController.updatePaymentStatus
);

// Complete payment
route.post("/payment/:paymentId/complete", paymentController.completePayment);

// Fail payment
route.post("/payment/:paymentId/fail", paymentController.failPayment);

// Expire payment
route.post("/payment/:paymentId/expire", paymentController.expirePayment);

// Generate KHQR only
route.post("/payment/generate-khqr", paymentController.generateKHQR);

// Verify payment
route.post("/payment/verify", paymentController.verifyPayment);

// Check expired payments (can be used as a cron job endpoint)
route.post("/payment/check-expired", paymentController.checkExpiredPayments);

export default route;
