"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class PaymentModel {
    constructor() {
        this.model = mongoose_1.default.model("Payment", new mongoose_1.default.Schema({
            orderId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Order",
                required: true,
            },
            method: {
                type: String,
                enum: ["BAKONG"],
                required: true,
            },
            amount: { type: Number, required: true },
            currency: {
                type: String,
                enum: ["KHR", "USD"],
                default: "KHR",
            },
            khqrString: { type: String },
            md5Hash: { type: String },
            transactionRef: { type: String },
            status: {
                type: String,
                enum: ["CREATED", "PENDING", "COMPLETED", "FAILED", "EXPIRED"],
                default: "CREATED",
            },
            paidAt: { type: Date },
            expiresAt: { type: Date },
        }, { timestamps: true }));
    }
    getModel() {
        return this.model;
    }
}
exports.default = new PaymentModel();
