// utils/redisHelpers.ts
import { Redis } from "ioredis";
import initRedis from "@/config/redis";

// Initialize Redis once
const redis: Redis = initRedis();

// ----------------- OTP -----------------
export const setOTP = async (
  key: string,
  otp: string,
  expirySeconds: number
): Promise<void> => {
  await redis.set(key, otp, "EX", expirySeconds);
};

export const getOTP = async (key: string): Promise<string | null> => {
  return await redis.get(key);
};

export const deleteOTP = async (key: string): Promise<void> => {
  await redis.del(key);
};

// ----------------- Refresh Token -----------------
export const setRefreshToken = async (
  userId: string,
  token: string,
  expirySeconds: number
): Promise<void> => {
  await redis.set(`refresh:${userId}`, token, "EX", expirySeconds);
};

export const getRefreshToken = async (
  userId: string
): Promise<string | null> => {
  return await redis.get(`refresh:${userId}`);
};

export const deleteRefreshToken = async (userId: string): Promise<void> => {
  await redis.del(`refresh:${userId}`);
};

// ----------------- User Session -----------------
export const setUserSession = async (
  userId: string,
  sessionData: string,
  expirySeconds: number
): Promise<void> => {
  await redis.set(`user:${userId}`, sessionData, "EX", expirySeconds);
};

export const getUserSession = async (
  userId: string
): Promise<string | null> => {
  return await redis.get(`user:${userId}`);
};

export const deleteUserSession = async (userId: string): Promise<void> => {
  await redis.del(`user:${userId}`);
};

// ----------------- Rate Limiting -----------------
export const isRateLimited = async (
  key: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> => {
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }
  return current > limit;
};
