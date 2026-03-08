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
const wishlist_1 = __importDefault(require("../../models/wishlist"));
class WishlistServiceImpl {
    constructor() {
        this.model = new wishlist_1.default().getModel();
    }
    addItemToWishlist(userId, item) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.create({
                userId: userId,
            }, item);
        });
    }
    removeItemFromWishlist(userId, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.deleteOne({
                userId: userId,
                _id: itemId,
            });
        });
    }
    getWishlistItems(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({
                userId: userId,
            });
        });
    }
    countWishlistItems(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.countDocuments({
                userId: userId,
            });
        });
    }
}
exports.default = WishlistServiceImpl;
