import { Router } from "express";
import orderController   from "@controllers/order.controller";
const route = Router();

route.post("/order" , orderController.createOrder);
route.get("/order" , orderController.getAllOrders);
route.get("/order/:id" , orderController.getOrdetById)
route.get("/order/users/:id", orderController.getOrderByUser);

export default route;