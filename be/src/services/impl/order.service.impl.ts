import { CreateOrderDTO } from "@dtos/request/order.request";
import OrderService from "@services/order.service";
import OrderModel from "@models/orders";
import mongoose from "mongoose";

export class OrderServiceImpl implements OrderService {
  private orderModel = OrderModel.getModel();
  async createOrder(data: CreateOrderDTO): Promise<CreateOrderDTO> {
    if (!data.item || data.item.length === 0) {
      throw new Error("Order must contain at least one item.");
    }

    const totalAmount = data.item.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderNumbes = `ORD-${Date.now()}`;
    const trackingNumber = `TRK-${Math.random()
      .toString(36)
      .substring(2, 9)
      .toLocaleUpperCase()}`;

    const order = await this.orderModel.create({
      orderNumber: orderNumbes,
      userId: new mongoose.Types.ObjectId(data.userId),
      item: data.item.map((item) => ({
        productId: new mongoose.Types.ObjectId(item.productId),
        variantId: new mongoose.Types.ObjectId(item.variantId),
        size: item.size,
        color: item.color,
        price: item.price,
        quantity: item.quantity,
        productName: item.productName,
      })),
      totalAmount: totalAmount,
      orderStatus: "pending",
      paymentStatus: "pending",
      delivery: {
        address: {
          street: data.delivery.address.street,
          city: data.delivery.address.city,
          state: data.delivery.address.state,
          postalCode: data.delivery.address.postalCode,
          country: data.delivery.address.country,
          location: {
            type: "Point",
            coordinates: data.delivery.address.location.coordinates,
          },
        },
        deliveryStatus: "preparing",
        trackingNumber,
        courier: data.delivery.courier,
      },
    } as any);

    return order as any ;  
  }
}

export default new OrderServiceImpl();

