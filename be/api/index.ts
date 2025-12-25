import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";

// Ensure DB is connected in serverless environment
let isConnected = false;
let app: any = null;

async function getApp() {
  if (!app) {
    // Dynamic import to ensure proper module resolution
    const appModule = await import("../src/app");
    const dbConfig = await import("../src/config/database.config");
    
    if (!isConnected) {
      try {
        await dbConfig.default.connectDB();
        isConnected = true;
        console.info("Database connected (serverless)");
      } catch (err) {
        console.error("Failed to connect DB in serverless:", err);
      }
    }
    
    app = appModule.default;
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const expressApp = await getApp();
  const expressHandler = serverless(expressApp);
  return expressHandler(req, res);
}
