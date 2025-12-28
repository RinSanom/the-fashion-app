import mongoose from "mongoose";

class DBConfig {
  public mongoURI: string;

  constructor() {
    this.mongoURI =
      process.env.MONGO_URI ||
      "mongodb://superuser:superuser@localhost:27017/theFashionAppDB?authSource=admin";
  }

  public async connectDB() {
    try {
      const options: any = {
        authSource: process.env.MONGO_AUTH_DB || "admin",
        serverSelectionTimeoutMS:
          Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 8000,
        connectTimeoutMS: 8000,
        socketTimeoutMS: 15000,
        maxPoolSize: 1, // Serverless: use minimal connections
        minPoolSize: 0,
      };

      await mongoose.connect(this.mongoURI, options);

      console.info("Database connected successfully.");
    } catch (err) {
      console.error("Failed to connect to MongoDB:", err);
      throw err; // Don't exit, throw for serverless to handle
    }
  }
}

export default new DBConfig();
