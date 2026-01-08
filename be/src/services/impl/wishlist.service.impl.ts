import WishlistModel, { IWishlist } from "@models/wishlist";
import { WishlistService } from "@services/wishlist.service";
import { Model, ObjectId } from "mongoose";

class WishlistServiceImpl implements WishlistService {
  private model: Model<IWishlist>;

  constructor() {
    this.model = new WishlistModel().getModel();
  }

  async addItemToWishlist(
    userId: ObjectId,
    item: IWishlist
  ): Promise<void | any> {
    return await this.model.create(
      {
        userId: userId,
      },
      item
    );
  }

  async removeItemFromWishlist(
    userId: ObjectId,
    itemId: ObjectId
  ): Promise<void> {
    await this.model.deleteOne({
      userId: userId,
      _id: itemId,
    });
  }

  async getWishlistItems(userId: ObjectId): Promise<IWishlist[]> {
    return await this.model.find({
      userId: userId,
    });
  }

  async countWishlistItems(userId: ObjectId): Promise<number> {
    return await this.model.countDocuments({
      userId: userId,
    });
  }
}

export default WishlistServiceImpl;
