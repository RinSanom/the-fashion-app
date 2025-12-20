import mongoose, { Document, Model } from "mongoose";

export interface IPromotion extends Document {
  code: string;
  discountValue: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

class PromotionModel {
  private model: Model<IPromotion>;

  constructor() {
    this.model = mongoose.model<IPromotion>(
      "Promotion",
      new mongoose.Schema(
        {
          code: { type: String, required: true },
          discountValue: { type: Number, required: true },
          startDate: { type: Date, required: true },
          endDate: { type: Date, required: true },
          isActive: { type: Boolean, required: true },
        },
        { timestamps: true }
      )
    );
  }

  getModel(): Model<IPromotion> {
    return this.model;
  }
}

export default new PromotionModel();
