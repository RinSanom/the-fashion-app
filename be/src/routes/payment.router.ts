import { Router } from "express";
import paymentController from "@controllers/payment.controller";

const route = Router();

route.post("/payment", paymentController.createPayment);

route.get("/payment/:paymentId", paymentController.getPaymentById);

route.get("/payment/order/:orderId", paymentController.getPaymentByOrderId);

route.get("/payment", paymentController.getAllPayments);

route.patch(
  "/payment/:paymentId/status",
  paymentController.updatePaymentStatus
);

route.post("/payment/:paymentId/complete", paymentController.completePayment);

route.post("/payment/:paymentId/fail", paymentController.failPayment);

route.post("/payment/:paymentId/expire", paymentController.expirePayment);

route.post("/payment/generate-khqr", paymentController.generateKHQR);

route.post("/payment/verify", paymentController.verifyPayment);

route.post("/payment/check-expired", paymentController.checkExpiredPayments);

export default route;
