import rateLimit from "express-rate-limit";
const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later."
    });
  }
});

export default rateLimitMiddleware;
