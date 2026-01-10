import mongoose, { Document, Model } from "mongoose";

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;

  method: "BAKONG";
  amount: number;
  currency: "KHR" | "USD";

  khqrString?: string; // Generated KHQR payload
  md5Hash?: string; // MD5 hash of the KHQR for verification
  transactionRef?: string; // Bank reference after payment

  status: "CREATED" | "PENDING" | "COMPLETED" | "FAILED" | "EXPIRED";

  paidAt?: Date;
  expiresAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

class PaymentModel {
  private model: Model<IPayment>;

  constructor() {
    this.model = mongoose.model<IPayment>(
      "Payment",
      new mongoose.Schema(
        {
          orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
          },

          method: {
            type: String,
            enum: ["BAKONG"],
            required: true,
          },

          amount: { type: Number, required: true },
          currency: {
            type: String,
            enum: ["KHR", "USD"],
            default: "KHR",
          },

          khqrString: { type: String },
          md5Hash: { type: String },

          transactionRef: { type: String },

          status: {
            type: String,
            enum: ["CREATED", "PENDING", "COMPLETED", "FAILED", "EXPIRED"],
            default: "CREATED",
          },

          paidAt: { type: Date },
          expiresAt: { type: Date },
        },
        { timestamps: true }
      )
    );
  }

  getModel(): Model<IPayment> {
    return this.model;
  }
}

export default new PaymentModel();
