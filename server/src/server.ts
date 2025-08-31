import dotenv from "dotenv";
dotenv.config();
import app from "@/app";
import { config } from "@/config";
import logger from "@/utils/logger";
import { connectToMongoDB, disconnectFromMongoDB } from "@/db/mongo";
import { connectRedis, disconnectRedis } from "@/config/redis";

async function startServer() {
  try {
    logger.info("🚀 Starting server...");

    // Connect to MongoDB
    logger.info("📦 Connecting to MongoDB...");
    await connectToMongoDB();
    logger.info("✅ MongoDB connected");

    // Connect to Redis
    logger.info("🔴 Connecting to Redis...");
    await connectRedis();
    logger.info("✅ Redis connected");

    // Start server
    const server = app.listen(config.PORT, () => {
      const message = `🚀 Server running on ${config.HOST}:${config.PORT}`;
      const docsMessage = `📚 API Docs: http://${config.HOST}:${config.PORT}/api-docs`;

      logger.info(message);
      logger.info(docsMessage);
    });

    // Handle server errors
    server.on("error", (error: NodeJS.ErrnoException) => {
      console.error({ err: error }, "❌ Server error");
      if (error.code === "EADDRINUSE") {
        logger.error(`❌ Port ${config.PORT} is already in use`);
      }
      process.exit(1);
    });

    // Graceful shutdown handler
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully...`);

      try {
        // Stop accepting new requests
        await new Promise<void>((resolve, reject) => {
          server.close(err => (err ? reject(err) : resolve()));
        });
        logger.info("✅ HTTP server closed");

        // Disconnect services
        await disconnectFromMongoDB();
        logger.info("✅ MongoDB disconnected");

        await disconnectRedis();
        logger.info("✅ Redis disconnected");

        process.exit(0);
      } catch (err) {
        console.error({ err }, "❌ Error during shutdown");
        process.exit(1);
      }
    };

    // Catch termination signals
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error({ err: error }, "❌ Failed to start server");
    process.exit(1);
  }
}

startServer();
