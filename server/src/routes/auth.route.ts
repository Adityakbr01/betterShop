import { validateSchema } from "@/middleware/validate";
import {
  completeRegistrationSchema,
  loginWithEmailSchema,
  registerWithMobileSchema,
  resendMobileOtpSchema,
  verifyMobileSchema
} from "@/validators/auth.validator";
import { Router } from "express";

const router = Router();

// Registration routes
router.post(
  "/register/mobile",
  validateSchema(registerWithMobileSchema),
);

router.post(
  "/register/mobile/verify",
  validateSchema(verifyMobileSchema),
);

router.post(
  "/register/complete",
  validateSchema(completeRegistrationSchema),
);

router.post(
  "/register/mobile/resend-otp",
  validateSchema(resendMobileOtpSchema)
);

// Login routes
router.post(
  "/login/email",
  validateSchema(loginWithEmailSchema),
);
router.post(
  "/login/mobile/send-otp",
  validateSchema(resendMobileOtpSchema),
);
router.post(
  "/login/mobile/verify-otp",
  validateSchema(verifyMobileSchema),
);

router.post(
  "/token/refresh",
);
router.get("/me");

export default router;
