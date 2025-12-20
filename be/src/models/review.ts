import mongoose, { Document, Model, ObjectId } from "mongoose";

export interface IReview extends Document {
  userId: ObjectId;
  productId: ObjectId;
  rating: number;
  comment: string;
}

class ReviewModel {
  private model: Model<IReview>;

  constructor() {
    this.model = mongoose.model<IReview>(
      "Review",
      new mongoose.Schema(
        {
          userId: { type: mongoose.Schema.Types.ObjectId, required: true },
          productId: { type: mongoose.Schema.Types.ObjectId, required: true },
          rating: { type: Number, required: true },
          comment: { type: String, required: true },
        },
        { timestamps: true }
      )
    );
  }

  getModel(): Model<IReview> {
    return this.model;
  }
}

export default new ReviewModel();
