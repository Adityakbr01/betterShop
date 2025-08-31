import mongoose from "mongoose";
import { config } from "@/config";
import logger from "@/utils/logger";

export const connectToMongoDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URL);
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error({ err: error }, "❌ Error connecting to MongoDB");
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    logger.warn("⚠️ MongoDB disconnected");
    process.exit(1);
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("🔄 MongoDB reconnected");
  });

  mongoose.connection.on("error", err => {
    console.error({ err }, "❌ MongoDB connection error");
  });
};

export const disconnectFromMongoDB = async (): Promise<void> => {
  await mongoose.disconnect();
};
