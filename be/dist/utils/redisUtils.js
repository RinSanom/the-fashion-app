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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_config_1 = require("../config/redis.config");
class RedisUtils {
    constructor() {
        this.redisConfig = null;
    }
    getConfig() {
        if (!this.redisConfig) {
            this.redisConfig = new redis_config_1.RedisConfig();
        }
        return this.redisConfig;
    }
    saveCodeVerification(code) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getConfig().getRedisClient().sadd("verification_codes", code);
            yield this.getConfig()
                .getRedisClient()
                .expire("verification_codes", 60 * 15);
        });
    }
    verifyCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getConfig()
                .getRedisClient()
                .sismember("verification_codes", code);
        });
    }
}
exports.default = new RedisUtils();
