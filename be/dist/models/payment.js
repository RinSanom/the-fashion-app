"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class PaymentModel {
    constructor() {
        this.model = mongoose_1.default.model("Payment", new mongoose_1.default.Schema({
            orderId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
            method: { type: String, required: true },
            transactionRef: { type: String, required: true },
            status: {
                type: String,
                enum: ["pending", "completed", "failed"],
                required: true,
            },
            paidAt: { type: Date, required: true },
        }, { timestamps: true }));
    }
    getModel() {
        return this.model;
    }
}
exports.default = new PaymentModel();
