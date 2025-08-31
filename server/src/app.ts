import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";

import { config } from "@/config";
import errorMiddleware from "@/middleware/error.middleware";
import rateLimitMiddleware from "@/middleware/rateLimit.middleware";
import logger from "@/utils/logger";
import routes from "@/routes/index";
import { notFound } from "./middleware/notFound";
import { securityMiddlewares } from "./middleware/security";

const app: express.Application = express();

app.use(...securityMiddlewares);
app.use(cookieParser());
app.use(compression());

app.use(
  morgan("combined", {
    stream: { write: message => logger.info(message.trim()) }
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
app.use(rateLimitMiddleware);

// Health check
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV
  });
});

// API routes
app.use("/api/v1", routes);

// Error handling
app.use(errorMiddleware);
app.use(notFound);

export default app;
