import { Request, Response } from "express";
import { ApiResponder } from "@/utils/response";
import {
  addOrUpdateAddressService,
  completeRegistrationService,
  getMeService,
  loginWithEmailService,
  refreshTokenService,
  sendEmailVerificationOtpService,
  sendMobileLoginOtpService,
  sendMobileOtpService,
  verifyEmailService,
  verifyMobileLoginOtpService,
  verifyMobileOtpService
} from "@/services/auth.service";
import { wrapAsync } from "@/utils/wrapAsync";
import { accessCookieOptions, refreshCookieOptions } from "@/config/cookieConfig";

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
    const { phoneNumber, email, name } = req.body as {
      phoneNumber: string;
      email: string;
      name: string;
    };
    console.log(req.body)
    const data = await completeRegistrationService({ phoneNumber, email, name });
    res.cookie("refreshToken", data.refreshToken, refreshCookieOptions);
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
    res.cookie("refreshToken", data.refreshToken, refreshCookieOptions);
    ApiResponder.success(res, 200, "User logged in", {
      user: data.user,
      accessToken: data.accessToken,
    });
  }),

  sendMobileLoginOtp: wrapAsync(async (req: Request, res: Response) => {
    const { phoneNumber } = req.body as { phoneNumber: string };
    const data = await sendMobileLoginOtpService(phoneNumber!);
    ApiResponder.success(res, 200, "OTP sent", data);
  }),

  verifyMobileLoginOtp: wrapAsync(async (req: Request, res: Response) => {
    const { phoneNumber, otp } = req.body as { phoneNumber: string; otp: string };
    const data = await verifyMobileLoginOtpService(phoneNumber!, otp);
    res.cookie("refreshToken", data.refreshToken, refreshCookieOptions);
    ApiResponder.success(res, 200, "User logged in", {
      user: data.user,
      accessToken: data.accessToken,
    });
  }),

  refreshToken: wrapAsync(async (req: Request, res: Response) => {
    const { refreshToken: rt } = req.cookies;
    const data = await refreshTokenService(rt);
    res.cookie("accessToken", data.accessToken, accessCookieOptions);
    ApiResponder.success(res, 200, "Tokens refreshed", data);
  }),

  sendEmailVerificationOtp: wrapAsync(async (req: Request, res: Response) => {
    const { email } = req.body as { email: string };
    const data = await sendEmailVerificationOtpService(email!);
    ApiResponder.success(res, 200, "OTP sent", data);
  }),

  verifyEmail: wrapAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body as { email: string; otp: string };
    const data = await verifyEmailService(email!, otp);
    ApiResponder.success(res, 200, "Email verified", data);
  }),

  addAddress: wrapAsync(async (req: Request, res: Response) => {
    const userId  = req.userId;
    const addressData = req.body;
    const data = await addOrUpdateAddressService(userId!, addressData);
    ApiResponder.success(res, 201, data.message, data);
  }),

  getMe: wrapAsync(async (req: Request, res: Response) => {
    const userId = req.userId!; // Set by authenticate middleware
    const user = await getMeService(userId);
    ApiResponder.success(res, 200, "User details", { user });
  }),
  logout: wrapAsync(async (_req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    ApiResponder.success(res, 200, "Logged out");
  })
};
