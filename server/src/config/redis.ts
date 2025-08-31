// src/config/redis.ts
import Redis from "ioredis";
import logger from "@/utils/logger";

let redis: Redis | null = null;
export const initRedis = () => {
  if (redis) return redis; // reuse existing client

  redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });

  redis.on("connect", () => {
    logger.info("✅ Successfully connected to Redis");
  });

  redis.on("error", err => {
    logger.error("❌ Redis connection error:", err);
  });

  redis.on("reconnecting", () => {
    logger.warn("♻️ Reconnecting to Redis...");
  });

  return redis;
};

export const connectRedis = async (): Promise<boolean> => {
  const client = initRedis();
  try {
    await client.ping();
    return true;
  } catch (error) {
    logger.error("❌ Redis ping failed:", error);
    return false;
  }
};

export const disconnectRedis = async (): Promise<void> => {
  if (redis) {
    await redis.quit();
    logger.info("✅ Redis disconnected");
    redis = null;
  }
};

export default initRedis;
