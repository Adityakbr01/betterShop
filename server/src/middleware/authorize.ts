// middlewares/authorize.ts
import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/utils/ApiError";

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.userId || !req.role) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!roles.includes(req.role)) {
      return next(new ApiError(403, "Insufficient permissions"));
    }

    next();
  };
};
