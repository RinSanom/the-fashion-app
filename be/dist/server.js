"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const database_config_1 = __importDefault(require("./config/database.config"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const resource_middleware_1 = __importDefault(require("./middlewares/resource.middleware"));
const ioredis_1 = __importDefault(require("ioredis"));
const otp_router_1 = __importDefault(require("./routes/otp.router"));
const passport_1 = __importDefault(require("passport"));
require("./lib/auth_passport/facebook");
require("./lib/auth_passport/gmail");
const wishlist_router_1 = __importDefault(require("./routes/wishlist.router"));
const http_1 = __importDefault(require("http"));
const websocket_config_1 = require("./config/websocket.config");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_config_1 = require("./config/swagger.config");
dotenv_1.default.config();
database_config_1.default.connectDB().then(() => {
    const app = (0, express_1.default)();
    const server = (0, websocket_config_1.initWS)(http_1.default.createServer(app));
    // mounting express plugin
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // mounting passport
    app.use(passport_1.default.initialize());
    const redisClient = new ioredis_1.default({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    });
    // Swagger UI (before routeValidation so it's not blocked)
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.swaggerSpec));
    app.get("/api-doc", (req, res) => {
        res.redirect(302, "/api-docs");
    });
    app.get("/api-docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swagger_config_1.swaggerSpec);
    });
    app.get("/api-doc.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swagger_config_1.swaggerSpec);
    });
    // mounting secure route middleware
    app.use(resource_middleware_1.default);
    app.get("/", (req, res) => res.send("The Fashion App Backend is running!"));
    // mounting routes
    app.use("/api/v1/auth", auth_router_1.default);
    app.use("/api/v1", otp_router_1.default);
    app.use("/api/v1/wishlist", wishlist_router_1.default);
    server.listen(Number(process.env.PORT) || 3000, () => console.log(`Server is running on port ${Number(process.env.PORT) || 3000}`));
    // mounting global error handler
    app.use(error_middleware_1.default);
});
