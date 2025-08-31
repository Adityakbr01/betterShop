import { Request, Response } from "express";
import { ApiResponder } from "@/utils/response";
import {
  completeRegistrationService,
  getMeService,
  loginWithEmailService,
  refreshTokenService,
  sendMobileLoginOtpService,
  sendMobileOtpService,
  verifyMobileLoginOtpService,
  verifyMobileOtpService
} from "@/services/auth.service";
import { wrapAsync } from "@/utils/wrapAsync";

export const authController = {
  registerWithMobile: wrapAsync(async (req: Request, res: Response) => {
    const { phoneNumber } = req.body as { phoneNumber: string };
    const data = await sendMobileOtpService(phoneNumber!);
    ApiResponder.success(res, 200, "OTP sent", data);
  }),

  verifyMobile: wrapAsync(async (req: Request, res: Response) => {
    const { phoneNumber, otp } = req.body as { phoneNumber: string; otp: string };
    const data = await verifyMobileOtpService(phoneNumber!, otp);
    ApiResponder.success(res, 200, "Mobile verified", data);
  }),

  completeRegistration: wrapAsync(async (req: Request, res: Response) => {
    const { phoneNumber, email, password, address } = req.body as {
      phoneNumber: string;
      email: string;
      password: string;
      address?: [];
    };
    const data = await completeRegistrationService({ phoneNumber, email, password, address });
    ApiResponder.success(res, 201, "User registered", data);
  }),

  resendMobileOtp: wrapAsync(async (req: Request, res: Response) => {
    const { phoneNumber } = req.body as { phoneNumber: string };
    const data = await sendMobileOtpService(phoneNumber!);
    ApiResponder.success(res, 200, "OTP sent", data);
  }),

  loginWithEmail: wrapAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };
    const data = await loginWithEmailService(email, password);
    ApiResponder.success(res, 200, "User logged in", data);
  }),

  sendMobileLoginOtp: wrapAsync(async (req: Request, res: Response) => {
    const { phoneNumber } = req.body as { phoneNumber: string };
    const data = await sendMobileLoginOtpService(phoneNumber!);
    ApiResponder.success(res, 200, "OTP sent", data);
  }),

  verifyMobileLoginOtp: wrapAsync(async (req: Request, res: Response) => {
    const { phoneNumber, otp } = req.body as { phoneNumber: string; otp: string };
    const data = await verifyMobileLoginOtpService(phoneNumber!, otp);
    ApiResponder.success(res, 200, "User logged in", data);
  }),

  refreshToken: wrapAsync(async (req: Request, res: Response) => {
    const { refreshToken: rt } = req.body as { refreshToken: string };
    const tokens = await refreshTokenService(rt);
    ApiResponder.success(res, 200, "Tokens refreshed", tokens);
  }),

  getMe: wrapAsync(async (req: Request, res: Response) => {
    const userId = req.userId!; // Set by authenticate middleware
    const user = await getMeService(userId);
    ApiResponder.success(res, 200, "User details", { user });
  })
};
