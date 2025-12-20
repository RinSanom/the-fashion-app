import { ObjectId } from "mongoose";

export type ProductVariant = {
  variantId: ObjectId;
  size: string;
  color: string;
  sku: string;
  price: number;
  stock: number;
};
