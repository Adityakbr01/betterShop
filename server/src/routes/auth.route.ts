import { Router } from "express";
import { validateSchema } from "@/middleware/validate";
import { authenticate } from "@/middleware/auth.middleware";
import {
  addAddressSchema,
  completeRegistrationSchema,
  loginWithEmailSchema,
  registerWithMobileSchema,
  resendMobileOtpSchema,
  sendEmailOtpSchema,
  verifyEmailSchema,
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


// --------------------- Email Verification --------------------
router.post(
  "/login/email/send-otp",
  authenticate,
  validateSchema(sendEmailOtpSchema),
  authController.sendEmailVerificationOtp
);

router.post(
  "/login/email/verify",
  authenticate,
  validateSchema(verifyEmailSchema),
  authController.verifyEmail
);


// --------------------- add address --------------------
router.post(
  "/me/addresses",
  authenticate,
  validateSchema(addAddressSchema),
  authController.addAddress
);

// -------------------- Token & profile --------------------
router.post("/token/refresh", authController.refreshToken);
router.get("/me", authenticate, authController.getMe);
router.post("/me/logout", authenticate, authController.logout);

export default router;
