require("module-alias/register");
const serverless = require("serverless-http");
const dotenv = require("dotenv");

dotenv.config();

// Ensure DB is connected in serverless environment
let isConnected = false;
let app = null;

async function getApp() {
  if (!app) {
    try {
      // ✅ IMPORTANT: use dist/, NOT src/
      const appModule = await import("../dist/app.js");
      const dbConfig = await import("../dist/config/database.config.js");

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

module.exports = async function handler(req, res) {
  try {
    const expressApp = await getApp();
    const expressHandler = serverless(expressApp);
    return expressHandler(req, res);
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};
