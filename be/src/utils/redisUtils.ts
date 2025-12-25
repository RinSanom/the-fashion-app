import { RedisConfig } from "config/redis.config";

class RedisUtils {
  private redisConfig: RedisConfig;

  constructor(redis: RedisConfig) {
    this.redisConfig = redis;
  }

  async saveCodeVerification(code: string) {
    await this.redisConfig.getRedisClient().sadd("verification_codes", code);
    await this.redisConfig
      .getRedisClient()
      .expire("verification_codes", 60 * 15);
  }

  async verifyCode(code: string) {
    return await this.redisConfig
      .getRedisClient()
      .sismember("verification_codes", code);
  }
}

export default new RedisUtils(new RedisConfig());
