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
const profile_service_impl_1 = __importDefault(require("../services/impl/profile.service.impl"));
class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
        this.delete = this.delete.bind(this);
        this.show = this.show.bind(this);
        this.update = this.update.bind(this);
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            res.status(200).send({
                message: "User profile retrieved successfully.",
                isSuccess: true,
                statusCode: 200,
                data: {
                    user: user,
                },
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = new ProfileController(new profile_service_impl_1.default());
