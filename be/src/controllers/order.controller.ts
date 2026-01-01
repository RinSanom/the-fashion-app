import { OrderServiceImpl } from "@services/impl/order.service.impl";
import { Request , Response } from "express";
class OrderController {
    private orderService: OrderServiceImpl;
    constructor(){
        this.orderService = new OrderServiceImpl();
    }

    createOrder = async (req: Request, res: Response): Promise<void> => {
        try {
            const order = await this.orderService.createOrder(req.body);
            res.status(201).json({success: true, message: "Order created successfully", data: order});
        } catch (error) {
            res.status(500).json({success: false, message: "Internal Server Error"});
        }
    }

}

export default new OrderController();