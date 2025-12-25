import dotenv from "dotenv";
import dbConfig from "./config/database.config";
import app from "./app";

dotenv.config();

// Connect to MongoDB then start local server (for dev)
dbConfig
  .connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    const port = Number(process.env.PORT) || 3000;
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
