import { Router } from "express";
import orderController   from "@controllers/order.controller";
const route = Router();

route.post("/order" , orderController.createOrder);

export default route;