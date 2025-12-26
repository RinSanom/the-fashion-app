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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../../models/user"));
const token_1 = __importDefault(require("../../models/token"));
const conflictContent_exception_1 = __importDefault(require("../../exceptions/conflictContent.exception"));
const unauthorized_exception_1 = __importDefault(require("../../exceptions/unauthorized.exception"));
const jwtUtils_1 = require("../../utils/jwtUtils");
class AuthServiceImpl {
    constructor() {
        this.model = user_1.default.getModel();
        this.modelToken = token_1.default.getModel();
    }
    login(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.findOne({
                email: credential.email,
                status: "active",
            });
            if (!user) {
                throw new unauthorized_exception_1.default("Invalid credentials");
            }
            const match = yield bcryptjs_1.default.compare(credential.password, user.passwordHash || "");
            if (!match) {
                throw new unauthorized_exception_1.default("Invalid credentials");
            }
            const access = (0, jwtUtils_1.generateAccessToken)(user._id.toString());
            const refresh = (0, jwtUtils_1.generateRefreshToken)(user._id.toString());
            yield this.modelToken.findOneAndUpdate({ userId: user._id }, {
                tokenHash: yield bcryptjs_1.default.hash(refresh, 10),
                expiredAt: new Date((yield (0, jwtUtils_1.verifyRefreshToken)(refresh)).exp *
                    1000),
            }, { upsert: true, new: true });
            return { access_token: access, refresh_token: refresh };
        });
    }
    register(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const existing = yield this.model.findOne({ email: credential.email });
            if (existing) {
                throw new conflictContent_exception_1.default("email already exist");
            }
            const created = yield this.model.create({
                fullName: credential.firstName + " " + credential.lastName,
                email: credential.email,
                gender: (_a = credential.gender) !== null && _a !== void 0 ? _a : "not_specified",
                role: (_b = credential.role) !== null && _b !== void 0 ? _b : "user",
                status: "active",
                passwordHash: yield bcryptjs_1.default.hash(credential.password, 10),
            });
            return created._id.toString();
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield token_1.default
                .getModel()
                .findOneAndDelete({ tokenHash: refreshToken });
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = (0, jwtUtils_1.verifyRefreshToken)(refreshToken);
            if (!decoded || (decoded === null || decoded === void 0 ? void 0 : decoded.invalid) || (decoded === null || decoded === void 0 ? void 0 : decoded.expired)) {
                throw new unauthorized_exception_1.default("Invalid refresh token");
            }
            const newAccessToken = (0, jwtUtils_1.generateAccessToken)(decoded.id);
            const newRefreshToken = (0, jwtUtils_1.generateRefreshToken)(decoded.id);
            yield this.modelToken.findOneAndUpdate({ userId: decoded.id }, {
                tokenHash: yield bcryptjs_1.default.hash(newRefreshToken, 10),
                expiredAt: new Date((yield (0, jwtUtils_1.verifyRefreshToken)(newRefreshToken))
                    .exp * 1000),
            }, { upsert: true, new: true });
            return { access_token: newAccessToken, refresh_token: newRefreshToken };
        });
    }
}
exports.default = AuthServiceImpl;
