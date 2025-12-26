const serverless = require("serverless-http");
require("dotenv").config();

let isConnected = false;
let cachedApp = null;

async function getApp() {
  if (!cachedApp) {
    try {
      // Import compiled files
      const appModule = await import("../dist/app.js");
      const dbConfigModule = await import("../dist/config/database.config.js");

      const app = appModule.default; // ✅ Express app
      const dbConfig = dbConfigModule.default; // ✅ DB config object

      if (!app || typeof app !== "function") {
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
    return serverless(app)(req, res);
  } catch (err) {
    console.error("Serverless handler crash:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};
