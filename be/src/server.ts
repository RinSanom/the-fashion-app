import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.router";
import databaseConfig from "config/database.config";
import errorHandler from "./middlewares/error.middleware";
import routeValidation from "middlewares/resource.middleware";

dotenv.config();

databaseConfig.connectDB().then(() => {
  const app = express();

  // mounting express plugin
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // mounting secure route middleware
  app.use(routeValidation);

  app.get("/", (req, res) => res.send("The Fashion App Backend is running!"));

  // mounting routes
  app.use("/api/v1/auth", authRouter);

  app.listen(Number(process.env.PORT) || 3000, () =>
    console.log(`Server is running on port ${Number(process.env.PORT) || 3000}`)
  );

  // mounting global error handler
  app.use(errorHandler);
});
