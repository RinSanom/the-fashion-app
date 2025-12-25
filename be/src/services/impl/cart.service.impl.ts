import CartModel, { ICart } from "@models/cart";
import AddTooCartService from "@services/addToCart.service";
import { AddToCartDTO } from "dtos/request/cart/addToCartDTO.request";
import mongoose, { Types } from "mongoose";

class CartServiceImpl implements AddTooCartService {
  async addToCart(data: AddToCartDTO): Promise<ICart> {
    const cartModel = CartModel.getModel();

    // Find existing cart for user
    let cart = await cartModel.findOne({
      userId: new Types.ObjectId(data.userId),
      status: "active",
    });

    if (cart) {
      // Check if item already exists in cart
      const existingItemIndex = cart.item.findIndex((item) => {
        return (
          item.variantId.toString() === data.variantId &&
          item.size === data.size &&
          item.color === data.color
        );
      });

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart.item[existingItemIndex].quantity += data.quantity;
      } else {
        // Add new item to cart
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
      // Create new cart
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
  getCartItemsByUserId(userId: string): Promise<ICart> {
    throw new Error("Method not implemented.");
  }
  updateCartItemQuantity(
    userId: string,
    productId: string,
    variantId: string,
    quantity: number
  ): Promise<ICart> {
    throw new Error("Method not implemented.");
  }
  removeFromCart(
    userId: string,
    productId: string,
    variantId: string
  ): Promise<ICart> {
    throw new Error("Method not implemented.");
  }
  clearCart(userId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default CartServiceImpl;
