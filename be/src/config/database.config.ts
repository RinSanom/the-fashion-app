import mongoose from "mongoose";

class DBConfig {
  public mongoURI: string;

  constructor() {
    this.mongoURI =
      process.env.DB_URI ||
      "mongodb://superuser:superuser@localhost:27017/theFashionAppDB?authSource=admin";
  }

  public connectDB = async () => {
    try {
      const options: any = {
        authSource: process.env.MONGO_AUTH_DB || "admin",
        serverSelectionTimeoutMS:
          Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 10000,
      };

      await mongoose.connect(this.mongoURI, options);

      console.info("Database connected successfully.");
    } catch (err) {
      console.error("Failed to connect to MongoDB:", err);
      process.exit(1);
    }
  };
}

export default new DBConfig();
