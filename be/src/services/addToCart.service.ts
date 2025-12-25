import { ICart } from "@models/cart";
import { AddToCartDTO } from "dtos/request/cart/addToCartDTO.request";

export default interface AddTooCartService {
    addToCart(data: AddToCartDTO): Promise<ICart>;
    getCartItemsByUserId(userId: string): Promise<ICart>;
    updateCartItemQuantity(userId: string, productId: string, variantId: string, quantity: number): Promise<ICart>;
    removeFromCart(userId: string, productId: string, variantId: string):Promise<ICart>;
    clearCart(userId: string): Promise<void>;
}