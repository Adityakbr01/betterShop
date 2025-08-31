// utils/jwt.ts
import jwt from "jsonwebtoken";

interface JwtPayloadData {
  userId: string;
  phone?: string;
  type: "access" | "refresh";
}

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("JWT secrets are missing in environment variables");
}

export const createAccessToken = (payload: {
  userId: string;
  phone: string;
}) => {
  return jwt.sign(
    {
      userId: payload.userId,
      phone: payload.phone,
      type: "access"
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" }
  );
};

export const createRefreshToken = (payload: { userId: string }) => {
  return jwt.sign(
    {
      userId: payload.userId,
      type: "refresh"
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "30d" }
  );
};

export const verifyAccessToken = (token: string): JwtPayloadData => {
  try {
    return jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayloadData;
  } catch (err) {
    throw new Error("Invalid or expired access token");
  }
};

export const verifyRefreshToken = (token: string): JwtPayloadData => {
  try {
    return jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayloadData;
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }
};
