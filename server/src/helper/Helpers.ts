import jwt from "jsonwebtoken";
import { config } from "@/config/index";

// ============================
// Helpers
// ============================
export const isValidMobileNumber = (mobile: string): boolean => {
  const mobileRegex = /^\+?[1-9]\d{1,14}$/;
  return mobileRegex.test(mobile.replace(/\s+/g, ""));
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return (
    password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password)
  );
};

export const generateTempToken = (
  mobileNumber: string,
  userId?: string
): string => {
  const payload = { mobileNumber, userId, type: "temp_registration" };
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "1h" });
};
