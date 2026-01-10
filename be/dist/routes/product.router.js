"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const router = (0, express_1.Router)();
router.post("/products", product_controller_1.default.createProduct);
router.get("/products", product_controller_1.default.getAllProducts);
router.get("/products/:id", product_controller_1.default.getProductById);
router.put("/products/:id", product_controller_1.default.updateProduct);
router.delete("/products/:id", product_controller_1.default.deleteProduct);
exports.default = router;
