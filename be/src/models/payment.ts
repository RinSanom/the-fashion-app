import mongoose, { Document, Model, ObjectId } from "mongoose";

export interface IPayment extends Document {
  orderId: ObjectId;
  method: string;
  transactionRef: string;
  status: "pending" | "completed" | "failed";
  paidAt: Date;
}

class PaymentModel {
  private model: Model<IPayment>;

  constructor() {
    this.model = mongoose.model<IPayment>(
      "Payment",
      new mongoose.Schema(
        {
          orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
          method: { type: String, required: true },
          transactionRef: { type: String, required: true },
          status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            required: true,
          },
          paidAt: { type: Date, required: true },
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
