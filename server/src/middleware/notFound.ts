// middlewares/notFound.ts
import { Request, Response, NextFunction } from "express";
//eslint-disable-next-line @typescript-eslint/no-unused-vars
export function notFound(req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
}
