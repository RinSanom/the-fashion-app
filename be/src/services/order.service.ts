import { CreateOrderDTO } from "@dtos/request/order.request";

export default interface OrderService {
    createOrder(data: CreateOrderDTO ): Promise<CreateOrderDTO>
}