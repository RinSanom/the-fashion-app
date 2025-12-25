import { Redis } from "ioredis";

export class RedisConfig {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
  }

  getRedisClient() {
    return this.redisClient;
  }
}
