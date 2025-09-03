import { z } from "zod";

// Mobile number regex (E.164 international format)
const mobileRegex = /^\+?[1-9]\d{1,14}$/;
const otpRegex = /^\d{6}$/;
const nameRegex = /^[a-zA-Z\s]+$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)/;

// =========================
// Schemas
// =========================

// Register with mobile
export const registerWithMobileSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, { message: "Mobile number is required" })
    .regex(mobileRegex, {
      message:
        "Invalid mobile number format. Please include country code (e.g., +1234567890)"
    })
});

// Verify mobile with OTP
export const verifyMobileSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, { message: "Mobile number is required" })
    .regex(mobileRegex, { message: "Invalid mobile number format" }),
  otp: z.string().regex(otpRegex, { message: "OTP must be exactly 6 digits" })
});

// Complete registration
export const completeRegistrationSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, { message: "Mobile number is required" })
    .regex(mobileRegex, { message: "Invalid mobile number format" }),

  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must not exceed 50 characters" })
    .regex(nameRegex, { message: "Name must contain only letters and spaces" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" })
    .trim()
    .toLowerCase()  
});

// Resend mobile OTP
export const resendMobileOtpSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, { message: "Mobile number is required" })
    .regex(mobileRegex, { message: "Invalid mobile number format" })
});

// Verify email with OTP
export const verifyEmailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" })
    .trim()
    .toLowerCase(),

  otp: z.string().regex(otpRegex, { message: "OTP must be exactly 6 digits" })
});

// Send email OTP
export const sendEmailOtpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" })
    .trim()
    .toLowerCase()
});

// Mobile param
export const phoneNumberParamSchema = z.object({
  phoneNumber: z
    .string()
    .regex(mobileRegex, { message: "Invalid mobile number format" })
});

// Email param
export const emailParamSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .trim()
    .toLowerCase()
});

export const loginWithEmailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(2, { message: "password must be at least 5 characters long" })
    .max(50, { message: "password must not exceed 20 characters" })
    .regex(passwordRegex, { message: "password" })
});

//addresses
export const addAddressSchema = z.object({
  street: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  postalCode: z.string().min(2).max(20),
  country: z.string().min(2).max(100),
  isDefault: z.boolean().optional(),
  addressId: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional()
});
