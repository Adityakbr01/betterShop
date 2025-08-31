/* any-disable no-console */

import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log directory path
const logDir = path.join(__dirname, "../logs");

// Ensure log directory exists
try {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
    console.log(`Created log directory: ${logDir}`);
  }
} catch (error) {
  if (error instanceof Error) {
    console.error(`Failed to create log directory: ${error.message}`);
  }
}

// Custom log format
const logFormat = winston.format.printf(
  ({ timestamp, level, message, moduleName }) => {
    const modulePrefix = moduleName ? `[${moduleName}] ` : "";
    return `[${timestamp}] ${level.toUpperCase()}: ${modulePrefix}${message}`;
  }
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug", // More verbose in development
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }), // Include stack traces for errors
    winston.format.json(), // Store logs in JSON format for easier parsing
    logFormat // Apply custom format for human-readable output
  ),
  transports: [
    // Save all logs with daily rotation
    new DailyRotateFile({
      filename: path.join(logDir, "app-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true, // Compress old logs
      maxSize: "20m", // Rotate if file exceeds 20MB
      maxFiles: "14d", // Keep logs for 14 days
      level: "info"
    }),
    // Save only errors with daily rotation
    new DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d", // Keep error logs for 30 days
      level: "error"
    })
  ]
});

// Console logging for development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Add colors for console
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      )
    })
  );
}

// Utility function to create a child logger with module-specific context
export const createModuleLogger = (moduleName: string) => {
  return logger.child({ moduleName });
};

// Error handling for logger initialization
logger.on("error", error => {
  console.error("Logger initialization error:", error.message);
});

// Log initialization
logger.info("Logger initialized", { moduleName: "Logger" });

export default logger;