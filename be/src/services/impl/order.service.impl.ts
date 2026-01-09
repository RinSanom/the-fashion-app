import { CreateOrderDTO } from "@dtos/request/order.request";
import OrderService from "@services/order.service";
import OrderModel, { IOrder } from "@models/orders";
import mongoose from "mongoose";
import { create } from "domain";

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
      items: data.item.map((item) => ({
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

    return order as any;
  }

  async getOrderById(orderId: string): Promise<IOrder> {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new Error("Order not found.");
    }
    return order;
  }

  async getAllOrders(
    page = 1,
    limit = 10
  ): Promise<{ data: IOrder[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    try {
      const [orders, total] = await Promise.all([
        this.orderModel
          .find()
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .exec(),
        this.orderModel.countDocuments(),
      ]);
      return {
        data: orders,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new Error("Error fetching orders.");
    }
  }

  async getOrderByUser(userId: string): Promise<IOrder[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    try {
      const orders = await this.orderModel
        .find({ userId: userId as any } as any)
        .sort({ createdAt: -1 })
        .exec();

      return orders;
    } catch (error) {
      throw new Error(`Error fetching orders for user: ${error}`);
    }
  }
}

export default new OrderServiceImpl();
