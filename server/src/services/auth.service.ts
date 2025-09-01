import { config } from "@/config";
import User from "@/models/User";
import { ApiError } from "@/utils/ApiError";
import { generateOtp } from "@/utils/genrateOtp";
import { createAccessToken, createRefreshToken } from "@/utils/jwt";
import {
  isRateLimited,
  setOTP,
  getOTP,
  deleteOTP,
  setRefreshToken,
  getRefreshToken
} from "@/utils/redisUtil";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendOtp } from "./otp/whatsappOtp";

const OTP_LENGTH = parseInt(config.DEFAOULT_OTP_LENGTH as string, 10);
const OTP_EXPIRY_MS = parseInt(config.OTP_EXPIRY_MS as string, 10);
const OTP_RESEND_COOLDOWN_MS = parseInt(config.OTP_RESEND_COOLDOWN_MS as string, 10);
const OTP_RESEND_LIMIT = parseInt(config.OTP_RESEND_LIMIT as string, 10);
const JWT_REFRESH_EXPIRES_INSeconds = 30 * 24 * 60 * 60; // 30 days in seconds


interface RefreshTokenPayload extends JwtPayload {
  userId: string;
  role: "user" | "admin";
  type: "refresh";
}

// -------------------- OTP / MOBILE REGISTRATION --------------------
export const sendMobileOtpService = async (phoneNumber: string) => {
  const normalized = phoneNumber.trim();
  const existingUser = await User.findOne({ phoneNumber: normalized });
  if (existingUser) {
    throw new ApiError(409, "Phone number already registered");
  }

  const otpKey = `otp:${normalized}`;
  const rateKey = `otp_rate:${normalized}`;

  // Rate limiting
  const limited = await isRateLimited(rateKey, OTP_RESEND_LIMIT, OTP_RESEND_COOLDOWN_MS / 1000);
  if (limited) throw new ApiError(429, "OTP resend limit reached. Please wait.");

  const code = generateOtp({ length: OTP_LENGTH });
  await setOTP(otpKey, code, OTP_EXPIRY_MS / 1000);

  await sendOtp({
    identifier: normalized,
    channel: "whatsapp",
    purpose: "Registration",
    code,
  });

  return { message: "OTP sent", phoneNumber: normalized };
};
export const verifyMobileOtpService = async (phoneNumber: string, otp: string) => {
  const normalized = phoneNumber.trim();
  const otpKey = `otp:${normalized}`;

  const storedOtp = await getOTP(otpKey);
  if (!storedOtp) throw new ApiError(400, "OTP expired or not found");
  if (storedOtp !== otp) throw new ApiError(400, "Invalid OTP");

  return { message: "Mobile verified" };
};
// -------------------- REGISTRATION --------------------
export const completeRegistrationService = async (params: {
  phoneNumber: string;
  email: string;
  password: string;
  address?: string[];
}) => {
  const normalizedPhone = params.phoneNumber.trim();
  const normalizedEmail = params.email.trim().toLowerCase();

  // Ensure mobile is verified
  const otpKey = `otp:${normalizedPhone}`;
  const verified = await getOTP(otpKey);
  if (!verified) throw new ApiError(400, "Mobile not verified for registration");

  const existingEmail = await User.findOne({ email: normalizedEmail });
  if (existingEmail) throw new ApiError(409, "Email already registered");

  // Create user
  const user = await User.create({
    email: normalizedEmail,
    password: params.password,
    phoneNumber: normalizedPhone,
    isPhoneVerified: true,
    isEmailVerified: false,
    address: params.address || [],
  });

  await deleteOTP(otpKey);

  // Generate tokens
  const accessToken = createAccessToken({ userId: user.id, role: user.role });
  const refreshToken = createRefreshToken({ userId: user.id, role: user.role });
  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};
// -------------------- LOGIN --------------------
export const loginWithEmailService = async (
  email: string,
  password: string
) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password"
  );

  console.log(user);
  if (!user) throw new ApiError(404, "Invalid credentials");

  const ok = await user.comparePassword(password); // implement password compare
  if (!ok) throw new ApiError(401, "Invalid credentials");

  const accessToken = createAccessToken({ userId: user.id, role: user.role });
  const refreshToken = createRefreshToken({ userId: user.id, role: user.role });
  user.refreshToken = refreshToken;
  await user.save();
  // ✅ Save refresh token only in Redis (not DB)
  await setRefreshToken(user.id.toString(), refreshToken, JWT_REFRESH_EXPIRES_INSeconds);
  //remove password and refrshToken
const { password: _password, refreshToken: _refreshToken, ...safeUser } = user.toObject();
return { user: safeUser, accessToken, refreshToken };
};
export const sendMobileLoginOtpService = async (phoneNumber: string) => {
  const normalized = phoneNumber
  const user = await User.findOne({ phoneNumber: normalized });
  if (!user) throw new ApiError(404, "User not found");

  const tsKey = `otp_ts:${normalized}`;
  const rateKey = `otp_rate:${normalized}`;
  const limited = await isRateLimited(
    rateKey,
    OTP_RESEND_LIMIT,
    OTP_RESEND_COOLDOWN_MS / 1000
  );
  if (limited)
    throw new ApiError(429, "OTP resend limit reached or cooldown active");
  const lastSentStr = await getOTP(tsKey);
  const lastSent = lastSentStr ? parseInt(lastSentStr, 10) : 0;
  if (Date.now() - lastSent < OTP_RESEND_COOLDOWN_MS) {
    throw new ApiError(429, "Please wait before requesting another OTP");
  }

  const otpKey = `otp:${normalized}`;
  const code = generateOtp({ length: OTP_LENGTH });
  await setOTP(otpKey, code, OTP_EXPIRY_MS / 1000);

  return await sendOtp({
    identifier: normalized,
    channel: "whatsapp",
    purpose: "Login",
    code
  });
};
export const verifyMobileLoginOtpService = async (
  phoneNumber: string,
  otp: string
) => {
  const normalized = phoneNumber
  const otpKey = `otp:${normalized}`;

  // Retrieve the OTP stored in Redis
  const storedOtp = await getOTP(otpKey);
  if (!storedOtp) throw new ApiError(400, "OTP expired or not found");
  if (storedOtp !== otp) throw new ApiError(400, "Invalid OTP");

  // OTP is valid, remove it from Redis to prevent reuse
  await deleteOTP(otpKey); // You need to implement deleteOTP or use Redis DEL

  // Find user
  const user = await User.findOne({ phoneNumber: normalized });
  if (!user) throw new ApiError(404, "User not found");

  // Generate tokens
  const accessToken = createAccessToken({ userId: user.id, role: user.role });
  const refreshToken = createRefreshToken({ userId: user.id, role: user.role });

  // Store refresh token
  await setRefreshToken(user.id, refreshToken, JWT_REFRESH_EXPIRES_INSeconds);
  return { user, accessToken, refreshToken };
};
// -------------------- REFRESH TOKEN --------------------
export const refreshTokenService = async (token: string) => {
  try {
    // ✅ Verify and decode refresh token
    const payload = jwt.verify(
      token,
      config.REFRESH_TOKEN_SECRET
    ) as RefreshTokenPayload;

    if (payload.type !== "refresh") {
      throw new ApiError(401, "Invalid token type");
    }

    // ✅ Check if token exists in Redis
    const storedToken = await getRefreshToken(payload.userId);
    if (!storedToken || storedToken !== token) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }
    // ✅ Find user
    const user = await User.findById(payload.userId);
    if (!user) throw new ApiError(401, "User not found");

    // ✅ Generate new access token
    const accessToken = createAccessToken({
      userId: user.id,
      role: user.role,
    });

    return { user, accessToken };
  } catch (err) {
    console.error("Refresh token error:", err);
    throw new ApiError(401, "Invalid or expired refresh token");
  }
};
// -------------------- GET CURRENT USER --------------------
export const getMeService = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};
