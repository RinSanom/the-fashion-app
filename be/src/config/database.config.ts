import { Mongoose } from "mongoose";

class DBConfig {
  public mongoURI: string;

  constructor() {
    this.mongoURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/theFashionAppDB";
  }

  public connectDB = async (mongo: Mongoose) => {
    try {
      await mongo.connect(this.mongoURI);
    } catch (err) {
      process.exit(1);
    }
  };
}

export default new DBConfig();
