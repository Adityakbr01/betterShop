import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const wrapAsync = (fn: AsyncRouteHandler) =>
  asyncHandler(async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error: unknown) {
      next(error);
    }
  });
