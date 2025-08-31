// utils/response.ts
import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T | null;
  errors?: Record<string, unknown> | null;
  timestamp: string;
  path?: string;
  statusCode?: number;
}

export class ApiResponder {
  static success<T>(
    res: Response,
    status = 200,
    message = "Success",
    data?: T
  ) {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      path: res.req.originalUrl,
      statusCode: status
    };
    return res.status(status).json(response);
  }

  static error(
    res: Response,
    message = "Internal Server Error",
    status = 500,
    errors: Record<string, unknown> | null = null
  ) {
    const response: ApiResponse = {
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: res.req.originalUrl,
      statusCode: status
    };
    return res.status(status).json(response);
  }
}
