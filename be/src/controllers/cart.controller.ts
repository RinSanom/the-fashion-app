import CartServiceImpl from "@services/impl/cart.service.impl";
import { Request , Response } from "express";

class CartController {
    private cartService: CartServiceImpl;
    constructor(){
        this.cartService = new CartServiceImpl();
    }

    addToCart = async (req: Request, res: Response): Promise<void> => {
        try {
            const cart = await this.cartService.addToCart(req.body);
            res.status(200).json({success: true, message: "Item added to cart successfully", data: cart});
        } catch (error) {
            res.status(500).json({success: false, message: "Internal Server Error"});
        }
    }

}

export default new  CartController();