import helmet from "helmet";
import corsMiddleware from "./cors.middleware";
import rateLimitMiddleware from "./rateLimit.middleware";

export const securityMiddlewares = [
  helmet(), // sets various HTTP headers for security
  corsMiddleware, // your custom CORS handling
  rateLimitMiddleware // request rate limiter
];
