import CartModel, { ICart } from "@models/cart";
import AddTooCartService from "@services/addToCart.service";
import { AddToCartDTO } from "dtos/request/cart/addToCartDTO.request";
import mongoose, { Types } from "mongoose";

class CartServiceImpl implements AddTooCartService {
  async addToCart(data: AddToCartDTO): Promise<ICart> {
    const cartModel = CartModel.getModel();

    let cart = await cartModel.findOne({
      userId: new Types.ObjectId(data.userId),
      status: "active",
    });

    if (cart) {
      const existingItemIndex = cart.item.findIndex((item) => {
        return (
          item.variantId.toString() === data.variantId &&
          item.size === data.size &&
          item.color === data.color
        );
      });

      if (existingItemIndex > -1) {
        cart.item[existingItemIndex].quantity += data.quantity;
      } else {
        cart.item.push({
          productId: new Types.ObjectId(data.productId),
          variantId: new Types.ObjectId(data.variantId),
          size: data.size,
          color: data.color,
          price: data.price,
          quantity: data.quantity,
        });
      }

      return await cart.save();
    } else {
      const newCart = new cartModel({
        userId: new Types.ObjectId(data.userId),
        item: [
          {
            productId: new Types.ObjectId(data.productId),
            variantId: new Types.ObjectId(data.variantId),
            size: data.size,
            color: data.color,
            price: data.price,
            quantity: data.quantity,
          },
        ],
        status: "active",
      });

      return await newCart.save();
    }
  }

  async getCartItemsByUserId(userId: string): Promise<ICart | null> {
    const cartModel = CartModel.getModel();
    return await cartModel
      .findOne({
        userId: new Types.ObjectId(userId),
        status: "active",
      })
      .exec();
  }

  async updateCartItemQuantity(
    userId: string,
    productId: string,
    variantId: string,
    quantity: number
  ): Promise<ICart> {
    const cartModel = CartModel.getModel();
    const cart = await cartModel.findOne({
      userId: new Types.ObjectId(userId),
      status: "active",
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const itemIndex = cart.item.findIndex((item) => {
      item.productId.toString() === productId &&
        item.variantId.toString() === variantId;
    });

    if (itemIndex === -1) {
      throw new Error("Item not found in cart");
    }

    cart.item[itemIndex].quantity = quantity;
    return await cart.save();
  }
  async removeFromCart(userId: string, variantId: string): Promise<ICart> {
    const cartModel = CartModel.getModel();
    const cart = await cartModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      status: "active",
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.item = cart.item.filter(
      (item) => item.variantId.toString() !== variantId
    );

    return await cart.save();
  }

  async clearCart(userId: string): Promise<void> {
    const cartModel = CartModel.getModel();
    await cartModel.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId), status: "active" },
      { status: "inactive" }
    );
  }
}

export default CartServiceImpl;
