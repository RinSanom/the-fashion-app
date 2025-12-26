"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisConfig = void 0;
const ioredis_1 = require("ioredis");
class RedisConfig {
    constructor() {
        this.redisClient = new ioredis_1.Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
        });
    }
    getRedisClient() {
        return this.redisClient;
    }
}
exports.RedisConfig = RedisConfig;
