import dotenv from "dotenv";
dotenv.config();

// ----------------- Main Config -----------------
export const config = {
  // Server Configuration
  PORT: process.env.PORT || 8000,
  HOST: process.env.HOST || "http://localhost:8000",
  NODE_ENV: process.env.NODE_ENV || "development",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",

  // Database Configuration
  DATABASE_POOL_SIZE: process.env.DATABASE_POOL_SIZE,
  MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost:27017/betterShop",

  // Authentication
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "your-secret-key",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "your-secret-key",
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "your-secret-key",

  // Redis Configuration
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  // Twilio Configuration
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOaUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TaOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  TWILIO_WHATSAPP_NUMBER: process.env.TWILIO_WHATSAPP_NUMBER,


  // OTP Configuration
  OTP_RESEND_COOLDOWN_MS: process.env.OTP_RESEND_COOLDOWN_MS || 30000,
  OTP_RESEND_LIMIT: process.env.OTP_RESEND_LIMIT || 3,
  OTP_EXPIRY_TIME_MS: process.env.OTP_EXPIRY_TIME_MS || 300000,
  DEFAOULT_OTP_LENGTH: process.env.DEFAOULT_OTP_LENGTH || 6,
};
