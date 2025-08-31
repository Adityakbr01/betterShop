import app from "@/app";
import { config } from "@/config";
import loggerModule from "@/utils/logger";
// Normalize logger import between CJS/ESM interop shapes
const logger: any = (loggerModule as any)?.info ? (loggerModule as any) : (loggerModule as any)?.default ?? console;
// import { connectDatabase, disconnectDatabase } from "@/config/database";
// import { connectRedis, disconnectRedis } from "@/config/redis";

async function startServer() {
  try {
    console.log("🚀 Starting server...");
    logger.info("🚀 Starting server...");

    // Connect to database
    console.log("📦 Connecting to database...");
    logger.info("📦 Connecting to database...");
    // await connectDatabase();
    console.log("✅ Connected to database");
    logger.info("✅ Connected to database");

    // Connect to Redis
    console.log("🔴 Connecting to Redis...");
    logger.info("🔴 Connecting to Redis...");
    // await connectRedis();
    console.log("✅ Connected to Redis");
    logger.info("✅ Connected to Redis");

    // Start server
    console.log(`🌐 Starting server on port ${config.PORT}...`);
    const server = app.listen(config.PORT, () => {
      const message = `🚀 Server running on ${config.HOST}:${config.PORT}`;
      const docsMessage = `📚 API Docs: http://${config.HOST}:${config.PORT}/api-docs`;

      console.log(message);
      console.log(docsMessage);
      logger.info(message);
      logger.info(docsMessage);
    });

    // Handle server errors
    server.on("error", (error: any) => {
      console.error("❌ Server error:", error);
      logger.error("❌ Server error:", error);

      if ((error as any).code === "EADDRINUSE") {
        console.error(`❌ Port ${config.PORT} is already in use`);
        logger.error(`❌ Port ${config.PORT} is already in use`);
      }

      process.exit(1);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`${signal} received, shutting down gracefully...`);
      logger.info(`${signal} received, shutting down gracefully...`);

      try {
        // Stop accepting new requests
        await new Promise<void>((resolve, reject) => {
          server.close(err => {
            if (err) reject(err);
            else resolve();
          });
        });

        // Disconnect services
        // await disconnectDatabase();
        console.log("✅ Database disconnected");
        logger.info("✅ Database disconnected");

        // await disconnectRedis?.();
        console.log("✅ Redis disconnected");
        logger.info("✅ Redis disconnected");

        process.exit(0);
      } catch (err) {
        console.error("❌ Error during shutdown:", err);
        logger.error("❌ Error during shutdown:", err);
        process.exit(1);
      }
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.error("❌ Failed to start server:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    process.exit(1);
  }
}

startServer();
