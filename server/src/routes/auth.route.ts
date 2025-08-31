import { Router } from "express";
import { validateSchema } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth.middleware";
import {
  completeRegistrationSchema,
  loginWithEmailSchema,
  registerWithMobileSchema,
  resendMobileOtpSchema,
  verifyMobileSchema
} from "@/validators/auth.validator";
import { Controllers } from "@/controllers";

const router = Router();
const { authController } = Controllers;

// -------------------- Registration routes --------------------
router.post(
  "/register/mobile",
  validateSchema(registerWithMobileSchema),
  authController.registerWithMobile
);

router.post(
  "/register/mobile/verify",
  validateSchema(verifyMobileSchema),
  authController.verifyMobile
);

router.post(
  "/register/complete",
  validateSchema(completeRegistrationSchema),
  authController.completeRegistration
);

router.post(
  "/register/mobile/resend-otp",
  validateSchema(resendMobileOtpSchema),
  authController.resendMobileOtp
);

// -------------------- Login routes --------------------
router.post(
  "/login/email",
  validateSchema(loginWithEmailSchema),
  authController.loginWithEmail
);

router.post(
  "/login/mobile/send-otp",
  validateSchema(resendMobileOtpSchema),
  authController.sendMobileLoginOtp
);

router.post(
  "/login/mobile/verify-otp",
  validateSchema(verifyMobileSchema),
  authController.verifyMobileLoginOtp
);

// -------------------- Token & profile --------------------
router.post("/token/refresh", authController.refreshToken);
router.get("/me", authenticate, authController.getMe);

export default router;
