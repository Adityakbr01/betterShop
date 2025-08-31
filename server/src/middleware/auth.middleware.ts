import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "@/config";
import { ApiError } from "@/utils/ApiError";

declare module "express" {
  interface Request {
    userId?: string;
    role?: string;
  }
}

interface JwtPayload {
  sub: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // Check for token in cookies first
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
    // Check for token in Authorization header (Bearer token)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.substring(7); // Remove "Bearer " prefix
    }

    if (!token) {
      throw new ApiError(401, "Access token not found");
    }

    // Verify the token
    const decoded = jwt.verify(
      token,
      config.ACCESS_TOKEN_SECRET as jwt.Secret
    ) as JwtPayload;

    if (!decoded.sub) {
      throw new ApiError(401, "Invalid token payload");
    }

    // Add userId and user to request object
    req.userId = decoded.sub;
    req.role = decoded.role;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, "Invalid access token"));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, "Access token expired"));
    }
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(401, "Authentication failed"));
  }
};

export default authenticate;
