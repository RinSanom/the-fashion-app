const serverless = require("serverless-http");
require("dotenv").config();

let isConnected = false;
let cachedApp = null;
let cachedHandler = null;

async function initializeApp() {
  if (cachedHandler) return cachedHandler;

  try {
    // Import compiled files (CommonJS)
    const appModule = require("../dist/app.js");
    const dbConfigModule = require("../dist/config/database.config.js");

    // Handle both ESM and CommonJS default exports
    const app = appModule.default || appModule;
    const dbConfig = dbConfigModule.default || dbConfigModule;

    if (!app) {
      console.error("App module received:", appModule);
      throw new Error("Express app not found");
    }

    if (!isConnected) {
      await dbConfig.connectDB();
      isConnected = true;
      console.info("Database connected (serverless)");
    }

    cachedApp = app;
    cachedHandler = serverless(app);
    return cachedHandler;
  } catch (err) {
    console.error("App init failed:", err);
    throw err;
  }
}

module.exports = async (req, res) => {
  try {
    const handler = await initializeApp();
    await handler(req, res);
  } catch (err) {
    console.error("Serverless handler crash:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};
