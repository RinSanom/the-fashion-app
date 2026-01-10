"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const database_config_1 = __importDefault(require("./config/database.config"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
database_config_1.default
    .connectDB()
    .then(() => {
    console.log("MongoDB connected successfully");
    const port = Number(process.env.PORT) || 3000;
    app_1.default.listen(port, () => console.log(`Server is running on port ${port}`));
})
    .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});
