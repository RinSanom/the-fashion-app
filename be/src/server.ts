import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.router";

dotenv.config();

const app = express();

app.use(cors());

// app.use(protect);

app.use(express.json());

app.get("/", (req, res) => res.send("The Fashion App Backend is running!"));

app.use("/api/v1/auth", authRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
