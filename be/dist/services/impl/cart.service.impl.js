"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const cart_1 = __importDefault(require("../../models/cart"));
const mongoose_1 = __importStar(require("mongoose"));
class CartServiceImpl {
    addToCart(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartModel = cart_1.default.getModel();
            let cart = yield cartModel.findOne({
                userId: new mongoose_1.Types.ObjectId(data.userId),
                status: "active",
            });
            if (cart) {
                const existingItemIndex = cart.item.findIndex((item) => {
                    return (item.variantId.toString() === data.variantId &&
                        item.size === data.size &&
                        item.color === data.color);
                });
                if (existingItemIndex > -1) {
                    cart.item[existingItemIndex].quantity += data.quantity;
                }
                else {
                    cart.item.push({
                        productId: new mongoose_1.Types.ObjectId(data.productId),
                        variantId: new mongoose_1.Types.ObjectId(data.variantId),
                        size: data.size,
                        color: data.color,
                        price: data.price,
                        quantity: data.quantity,
                    });
                }
                return yield cart.save();
            }
            else {
                const newCart = new cartModel({
                    userId: new mongoose_1.Types.ObjectId(data.userId),
                    item: [
                        {
                            productId: new mongoose_1.Types.ObjectId(data.productId),
                            variantId: new mongoose_1.Types.ObjectId(data.variantId),
                            size: data.size,
                            color: data.color,
                            price: data.price,
                            quantity: data.quantity,
                        },
                    ],
                    status: "active",
                });
                return yield newCart.save();
            }
        });
    }
    getCartItemsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartModel = cart_1.default.getModel();
            return yield cartModel
                .findOne({
                userId: new mongoose_1.Types.ObjectId(userId),
                status: "active",
            })
                .exec();
        });
    }
    updateCartItemQuantity(userId, productId, variantId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartModel = cart_1.default.getModel();
            const cart = yield cartModel.findOne({
                userId: new mongoose_1.Types.ObjectId(userId),
                status: "active",
            });
            if (!cart) {
                throw new Error("Cart not found");
            }
            const itemIndex = cart.item.findIndex((item) => {
                item.productId.toString() === productId &&
                    item.variantId.toString() === variantId;
            });
            if (itemIndex === -1) {
                throw new Error("Item not found in cart");
            }
            cart.item[itemIndex].quantity = quantity;
            return yield cart.save();
        });
    }
    removeFromCart(userId, variantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartModel = cart_1.default.getModel();
            const cart = yield cartModel.findOne({
                userId: new mongoose_1.default.Types.ObjectId(userId),
                status: "active",
            });
            if (!cart) {
                throw new Error("Cart not found");
            }
            cart.item = cart.item.filter((item) => item.variantId.toString() !== variantId);
            return yield cart.save();
        });
    }
    clearCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartModel = cart_1.default.getModel();
            yield cartModel.findOneAndUpdate({ userId: new mongoose_1.default.Types.ObjectId(userId), status: "active" }, { status: "inactive" });
        });
    }
}
exports.default = CartServiceImpl;
