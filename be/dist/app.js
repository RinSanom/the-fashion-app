"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const product_router_1 = __importDefault(require("./routes/product.router"));
const cart_router_1 = __importDefault(require("./routes/cart.router"));
const otp_router_1 = __importDefault(require("./routes/otp.router"));
const resource_middleware_1 = __importDefault(require("./middlewares/resource.middleware"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
dotenv_1.default.config();
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(passport_1.default.initialize());
    // Secure route middleware (adjust as needed for serverless)
    app.use(resource_middleware_1.default);
    // Health check
    app.get("/", (req, res) => res.send("The Fashion App Backend is running!"));
    // Routes
    app.use("/api/v1/auth", auth_router_1.default);
    app.use("/api/v1", product_router_1.default);
    app.use("/api/v1", cart_router_1.default);
    app.use("/api/v1", otp_router_1.default);
    // Global error handler
    app.use(error_middleware_1.default);
    return app;
};
exports.createApp = createApp;
exports.default = (0, exports.createApp)();
