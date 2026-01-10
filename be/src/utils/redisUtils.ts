import { RedisConfig } from "config/redis.config";

class RedisUtils {
  private redisConfig: RedisConfig | null = null;

  private getConfig(): RedisConfig {
    if (!this.redisConfig) {
      this.redisConfig = new RedisConfig();
    }
    return this.redisConfig;
  }

  async saveCodeVerification(code: string) {
    await this.getConfig().getRedisClient().sadd("verification_codes", code);
    await this.getConfig()
      .getRedisClient()
      .expire("verification_codes", 60 * 15);
  }

  async verifyCode(code: string) {
    return await this.getConfig()
      .getRedisClient()
      .sismember("verification_codes", code);
  }
}

export default new RedisUtils();
