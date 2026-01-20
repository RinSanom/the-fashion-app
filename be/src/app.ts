import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import authRouter from "./routes/auth.router";
import productRouter from "./routes/product.router";
import cartRouter from "./routes/cart.router";
import otpRouter from "./routes/otp.router";
import routeValidation from "./middlewares/resource.middleware";
import errorHandler from "./middlewares/error.middleware";
import orderRouter from "routes/order.router";
import paymentRouter from "routes/payment.router";

dotenv.config();

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(passport.initialize());


  app.use(routeValidation);

  // Health check - responds immediately without waiting for DB
  app.get("/", (req, res) => {
    res.status(200).json({
      status: "ok",
      message: "The Fashion App Backend is running!",
      timestamp: new Date().toISOString(),
    });
  });

  // Routes
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1", productRouter);
  app.use("/api/v1", cartRouter);
  app.use("/api/v1", otpRouter);
  app.use("/api/v1", orderRouter);
  app.use("/api/v1", paymentRouter);

  // Global error handler
  app.use(errorHandler);

  return app;
};

export default createApp();
