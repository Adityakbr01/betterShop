// middlewares/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validateSchema =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        // Use `issues` instead of `errors`
        res.status(400).json({
          errors: err.issues.map(issue => ({
            path: issue.path.join("."), // e.g. "mobileNumber"
            message: issue.message, // e.g. "Required"
            code: issue.code // e.g. "invalid_type"
          }))
        });
        return;
      }

      // Fallback for unknown errors
      res.status(400).json({
        error: "Invalid request"
      });
      return;
    }
  };
