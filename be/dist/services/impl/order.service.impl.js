"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServiceImpl = void 0;
const orders_1 = __importDefault(require("../../models/orders"));
const mongoose_1 = __importDefault(require("mongoose"));
class OrderServiceImpl {
    constructor() {
        this.orderModel = orders_1.default.getModel();
    }
    createOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.item || data.item.length === 0) {
                throw new Error("Order must contain at least one item.");
            }
            const totalAmount = data.item.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const orderNumbes = `ORD-${Date.now()}`;
            const trackingNumber = `TRK-${Math.random()
                .toString(36)
                .substring(2, 9)
                .toLocaleUpperCase()}`;
            const order = yield this.orderModel.create({
                orderNumber: orderNumbes,
                userId: new mongoose_1.default.Types.ObjectId(data.userId),
                items: data.item.map((item) => ({
                    productId: new mongoose_1.default.Types.ObjectId(item.productId),
                    variantId: new mongoose_1.default.Types.ObjectId(item.variantId),
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
            });
            return order;
        });
    }
    getOrderById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.orderModel.findById(orderId);
            if (!order) {
                throw new Error("Order not found.");
            }
            return order;
        });
    }
    getAllOrders() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            const skip = (page - 1) * limit;
            try {
                const [orders, total] = yield Promise.all([
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
            }
            catch (error) {
                throw new Error("Error fetching orders.");
            }
        });
    }
    getOrderByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                throw new Error("Invalid user ID");
            }
            try {
                const orders = yield this.orderModel
                    .find({ userId: userId })
                    .sort({ createdAt: -1 })
                    .exec();
                return orders;
            }
            catch (error) {
                throw new Error(`Error fetching orders for user: ${error}`);
            }
        });
    }
}
exports.OrderServiceImpl = OrderServiceImpl;
exports.default = new OrderServiceImpl();
