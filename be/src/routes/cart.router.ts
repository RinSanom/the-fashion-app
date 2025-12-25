import cart from "@models/cart";
import { Router } from "express";
import cartController from "@controllers/cart.controller";

const router = Router();

router.post("/cart", cartController.addToCart);

export default router;