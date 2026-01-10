import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.router";
import databaseConfig from "config/database.config";
import errorHandler from "./middlewares/error.middleware";
import routeValidation from "middlewares/resource.middleware";
import redis from "ioredis";
import otpRouter from "routes/otp.router";
import passport from "passport";
import "@lib/auth_passport/facebook";
import "@lib/auth_passport/gmail";
import wishlistRouter from "routes/wishlist.router";

dotenv.config();

dbConfig
  .connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    const port = Number(process.env.PORT) || 3000;
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

  // mounting secure route middleware
  app.use(routeValidation);

  app.get("/", (req, res) => res.send("The Fashion App Backend is running!"));

  // mounting routes
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1", otpRouter);
  app.use("/api/v1/wishlist", wishlistRouter);

  app.listen(Number(process.env.PORT) || 3000, () =>
    console.log(`Server is running on port ${Number(process.env.PORT) || 3000}`)
  );

  // mounting global error handler
  app.use(errorHandler);
});
