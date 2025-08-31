// utils/cookieConfig.ts
import { config } from "@/config";
import { CookieOptions } from "express";

const isProd = config.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: isProd, // true only for HTTPS in production
  sameSite: isProd ? "strict" : "lax",
  path: "/"
};

// For access tokens (short-lived)
export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "strict" : "lax", // now correctly typed
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
};

export const accessCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd ? true : false,
  sameSite: isProd ? "none" : "lax", // union type is valid now
  path: "/",
  maxAge: 15 * 60 * 1000 // 15 minutes
};
