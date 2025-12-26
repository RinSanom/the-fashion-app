const serverless = require("serverless-http");
require("dotenv").config();

let isConnected = false;
let cachedApp = null;
let handler = null;

async function getApp() {
  if (!cachedApp) {
    try {
      // Import compiled files (CommonJS)
      const appModule = require("../dist/app.js");
      const dbConfigModule = require("../dist/config/database.config.js");

      // Handle both ESM and CommonJS default exports
      const app = appModule.default || appModule;
      const dbConfig = dbConfigModule.default || dbConfigModule;

      if (!app || typeof app !== "function") {
        console.error("App module received:", appModule);
        throw new Error("Express app is not a function");
      }

      if (!isConnected) {
        await dbConfig.connectDB();
        isConnected = true;
        console.info("Database connected (serverless)");
      }

      cachedApp = app;
    } catch (err) {
      console.error("App init failed:", err);
      throw err;
    }
  }
  return cachedApp;
}

module.exports = async (req, res) => {
  try {
    const app = await getApp();
    if (!handler) {
      handler = serverless(app);
    }
    return handler(req, res);
  } catch (err) {
    console.error("Serverless handler crash:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};
