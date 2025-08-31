import { ApiError } from "@/utils/ApiError";
import logger from "@/utils/logger";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

/**
 * Middleware: Handles 404 - Route Not Found
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const message = `Route ${req.originalUrl} not found`;
  next(new ApiError(404, message));
};

/**
 * Middleware: Handles all unhandled errors globally
 */

interface ICustomError {
  statusCode?: number;
  message?: string;
  stack?: string;
}

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let stack: string | undefined;

  // Log the raw error to console for debugging
  console.error("❌ Error caught by middleware:");
  console.error(err);

  // Handle different error types
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    console.error("Zod validation error:", err.issues);
    logger.error("Zod validation error:", err.issues);
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    console.error(`API Error [${statusCode}]:`, message);
    logger.error(`API Error [${statusCode}]:`, message);
  } else if (err instanceof Error) {
    message = err.message;
    stack = err.stack;
    console.error("Standard Error:", err.message);
    console.error("Stack trace:", err.stack);
    logger.error("Standard Error:", { message: err.message, stack: err.stack });
  } else if (typeof err === "object" && err !== null) {
    const customError = err as ICustomError;
    statusCode = customError.statusCode ?? statusCode;
    message = customError.message ?? message;
    stack = customError.stack;
    console.error("Custom Error:", customError);
    logger.error("Custom Error:", customError);
  } else {
    console.error("Unknown error type:", typeof err, err);
    logger.error("Unknown error type:", { type: typeof err, error: err });
  }

  // Log request details
  const errorDetails = {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message,
    userAgent: req.get("User-Agent"),
    ip: req.ip,
    timestamp: new Date().toISOString()
  };

  console.error("Request details:", errorDetails);
  logger.error(`[${req.method}] ${req.originalUrl} - ${message}`, errorDetails);

  // Log stack trace in development
  if (process.env.NODE_ENV !== "production" && stack) {
    console.error("Stack trace:", stack);
    logger.error("Stack trace:", stack);
  }

  // Send error response
  const response: any = {
    success: false,
    message,
    statusCode
  };

  // Include stack trace in development
  if (process.env.NODE_ENV !== "production" && stack) {
    response.stack = stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
