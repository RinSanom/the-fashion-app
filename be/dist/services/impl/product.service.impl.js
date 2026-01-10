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
const product_1 = __importDefault(require("../../models/product"));
class ProductServiceImpl {
    createProduct(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const productModel = product_1.default.getModel();
            const newProduct = new productModel(data);
            return yield newProduct.save();
        });
    }
    getAllProducts(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const productModel = product_1.default.getModel();
            // Build query object
            const query = {};
            // Text filters (partial match, case-insensitive)
            if (filters === null || filters === void 0 ? void 0 : filters.name) {
                query.name = { $regex: filters.name, $options: "i" };
            }
            if (filters === null || filters === void 0 ? void 0 : filters.brand) {
                query.brand = { $regex: filters.brand, $options: "i" };
            }
            if (filters === null || filters === void 0 ? void 0 : filters.category) {
                query.category = { $regex: filters.category, $options: "i" };
            }
            if (filters === null || filters === void 0 ? void 0 : filters.status) {
                query.status = filters.status;
            }
            // Filter by variant properties
            if (filters === null || filters === void 0 ? void 0 : filters.size) {
                query["variants.size"] = filters.size;
            }
            if (filters === null || filters === void 0 ? void 0 : filters.color) {
                query["variants.color"] = { $regex: filters.color, $options: "i" };
            }
            // Price range filter
            if ((filters === null || filters === void 0 ? void 0 : filters.minPrice) !== undefined || (filters === null || filters === void 0 ? void 0 : filters.maxPrice) !== undefined) {
                query["variants.price"] = {};
                if ((filters === null || filters === void 0 ? void 0 : filters.minPrice) !== undefined) {
                    query["variants.price"].$gte = filters.minPrice;
                }
                if ((filters === null || filters === void 0 ? void 0 : filters.maxPrice) !== undefined) {
                    query["variants.price"].$lte = filters.maxPrice;
                }
            }
            // Pagination
            const page = (filters === null || filters === void 0 ? void 0 : filters.page) || 1;
            const limit = (filters === null || filters === void 0 ? void 0 : filters.limit) || 10;
            const skip = (page - 1) * limit;
            // Sorting
            const sortBy = (filters === null || filters === void 0 ? void 0 : filters.sortBy) || "createdAt";
            const sortOrder = (filters === null || filters === void 0 ? void 0 : filters.sortOrder) === "asc" ? 1 : -1;
            const sort = { [sortBy]: sortOrder };
            // Execute query with pagination
            const [products, total] = yield Promise.all([
                productModel.find(query).sort(sort).skip(skip).limit(limit).exec(),
                productModel.countDocuments(query).exec(),
            ]);
            return {
                data: products,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const productModel = product_1.default.getModel();
            return yield productModel.findOne({ productId: id }).exec();
        });
    }
    updateProduct(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const productModel = product_1.default.getModel();
            const updatedProduct = yield productModel
                .findOneAndUpdate({ productId: id }, data, {
                new: true,
                runValidators: true,
            })
                .exec();
            if (!updatedProduct) {
                throw new Error("Product not found");
            }
            return updatedProduct;
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const productModel = product_1.default.getModel();
            yield productModel.findOneAndDelete({ productId: id }).exec();
        });
    }
}
exports.default = ProductServiceImpl;
