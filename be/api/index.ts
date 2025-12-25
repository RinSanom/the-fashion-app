import "module-alias/register";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";
import dotenv from "dotenv";

dotenv.config();

// Ensure DB is connected in serverless environment
let isConnected = false;
let app: any = null;

async function getApp() {
  if (!app) {
    try {
      // Dynamic import to ensure proper module resolution
      const appModule = await import("../src/app");
      const dbConfig = await import("../src/config/database.config");

      if (!isConnected) {
        await dbConfig.default.connectDB();
        isConnected = true;
        console.info("Database connected (serverless)");
      }

      app = appModule.default;
    } catch (err) {
      console.error("Error initializing app:", err);
      throw err;
    }
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = await getApp();
    const expressHandler = serverless(expressApp);
    return expressHandler(req, res);
  } catch (err: any) {
    console.error("Handler error:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}
