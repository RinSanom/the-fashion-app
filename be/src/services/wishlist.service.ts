import wishlist, { IWishlist } from "@models/wishlist";
import { ObjectId } from "mongoose";

export interface WishlistService {
  addItemToWishlist(userId: ObjectId, item: IWishlist): Promise<any | void>;
  removeItemFromWishlist(userId: ObjectId, itemId: ObjectId): Promise<void>;
  getWishlistItems(userId: ObjectId): Promise<IWishlist[]>;
  countWishlistItems(userId: ObjectId): Promise<number>;
}
