import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routes/auth.router";
import productRouter from "./routes/product.router";
import dbConfig from "./config/database.config";
import cartRouter from "./routes/cart.router";

dotenv.config();

const app = express();

// Connect to MongoDB
dbConfig
  .connectDB(mongoose)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(cors());

// app.use(protect);

app.use(express.json());

app.get("/", (req, res) => res.send("The Fashion App Backend is running!"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1" , cartRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
