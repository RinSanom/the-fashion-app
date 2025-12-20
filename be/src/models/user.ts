import { Addresses } from "@ctypes/address";
import { OauthProvider } from "@ctypes/oauth_provider";
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string | null;
  role: "user" | "admin";
  status: "active" | "banned";
  oauthProviders: OauthProvider[];
  addresses: Addresses[];
}

class UserModel {
  private model: Model<IUser>;

  constructor() {
    this.model = mongoose.model<IUser>(
      "users",
      new Schema<IUser>(
        {
          fullName: { type: String, required: true },
          email: { type: String, required: true, unique: true },
          passwordHash: { type: String, default: null },
          role: { type: String, required: true, enum: ["user", "admin"] },
          status: {
            type: String,
            required: true,
            enum: ["active", "banned"],
          },
          oauthProviders: [{ type: Schema.Types.Mixed }],
          addresses: [{ type: Schema.Types.Mixed }],
        },
        { timestamps: true }
      )
    );
  }

  getModel(): Model<IUser> {
    return this.model;
  }
}

export default new UserModel();
