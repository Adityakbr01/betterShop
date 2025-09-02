"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./axios";
import { useAuthStore } from "../store/auth";
import { useRouter } from "next/navigation";

// Base API Response structure
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Request Types
interface RegisterMobileRequest {
  phoneNumber: string;
}

interface VerifyMobileRequest {
  phoneNumber: string;
  otp: string;
}

interface CompleteRegistrationRequest {
  phoneNumber: string;
  email: string;
  name: string
}

interface LoginEmailRequest {
  email: string;
  password: string;
}

// Response Data Types
interface User {
  id: string;
  email: string;
  phoneNumber: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  role: string;
  address?: string[];
}

interface AuthTokens {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface OtpResponse {
  tempToken?: string;
  remainingAttempts?: number;
}

interface VerificationResponse {
  verified: boolean;
  tempToken?: string;
}

interface SendEmailVerificationOtpResponse {
  tempToken?: string;
  remainingAttempts?: number;
  message?: string;
}

interface VerifyEmailRequest {
  email: string;
  otp: string;
}

interface SendEmailVerificationOtpRequest {
  email: string;
}


interface AddAddressRequest {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressId?: string; // for editing
}


// Typed API Response Types
type RegisterMobileResponse = ApiResponse<OtpResponse>;
type VerifyMobileResponse = ApiResponse<VerificationResponse>;
type CompleteRegistrationResponse = ApiResponse<AuthTokens>;
type ResendOtpResponse = ApiResponse<OtpResponse>;
type LoginEmailResponse = ApiResponse<AuthTokens>;
type SendMobileLoginOtpResponse = ApiResponse<OtpResponse>;
type VerifyMobileLoginOtpResponse = ApiResponse<AuthTokens>;
type VerifyEmailResponse = ApiResponse<AuthTokens>;

export const useAuthMutations = () => {
  const { setUser, setAccessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleAuthSuccess = (response: ApiResponse<AuthTokens>) => {
    if (response.success && response.data) {
      router.push("/");
    }
  };

  // Registration mutations
  const registerMobile = useMutation<RegisterMobileResponse, Error, RegisterMobileRequest>({
    mutationFn: async (data: RegisterMobileRequest) => {
      const response = await api.post<RegisterMobileResponse>("/auth/register/mobile", data);
      return response.data;
    },
  });

  const verifyMobile = useMutation<VerifyMobileResponse, Error, VerifyMobileRequest>({
    mutationFn: async (data: VerifyMobileRequest) => {
      const response = await api.post<VerifyMobileResponse>("/auth/register/mobile/verify", data);
      return response.data;
    },
  });

  const completeRegistration = useMutation<CompleteRegistrationResponse, Error, CompleteRegistrationRequest>({
    mutationFn: async (data: CompleteRegistrationRequest) => {
      const response = await api.post<CompleteRegistrationResponse>("/auth/register/complete", data);
      return response.data;
    },
    onSuccess: handleAuthSuccess,
  });

  const resendOtp = useMutation<ResendOtpResponse, Error, RegisterMobileRequest>({
    mutationFn: async (data: RegisterMobileRequest) => {
      const response = await api.post<ResendOtpResponse>("/auth/register/mobile/resend-otp", data);
      return response.data;
    },
  });

  // Login mutations
  const loginWithEmail = useMutation<LoginEmailResponse, Error, LoginEmailRequest>({
    mutationFn: async (data: LoginEmailRequest) => {
      const response = await api.post<LoginEmailResponse>("/auth/login/email", data);
      return response.data;
    },
    onSuccess: handleAuthSuccess,
  });

  const sendMobileLoginOtp = useMutation<SendMobileLoginOtpResponse, Error, RegisterMobileRequest>({
    mutationFn: async (data: RegisterMobileRequest) => {
      const response = await api.post<SendMobileLoginOtpResponse>("/auth/login/mobile/send-otp", data);
      return response.data;
    },
  });

  const verifyMobileLoginOtp = useMutation<VerifyMobileLoginOtpResponse, Error, VerifyMobileRequest>({
    mutationFn: async (data: VerifyMobileRequest) => {
      const response = await api.post<VerifyMobileLoginOtpResponse>("/auth/login/mobile/verify-otp", data);
      return response.data;
    },
    onSuccess: handleAuthSuccess,
  });


  //send otp for email Verification
  const sendEmailVerificationOtp = useMutation<SendEmailVerificationOtpResponse, Error, SendEmailVerificationOtpRequest>({ //email take
    mutationFn: async (data: SendEmailVerificationOtpRequest) => {
      const response = await api.post<SendEmailVerificationOtpResponse>("/auth/login/email/send-otp", data);
      return response.data;
    },
  });

  //Verify email
  const verifyEmail = useMutation<VerifyEmailResponse, Error, VerifyEmailRequest>({ //email,otp take
    mutationFn: async (data: VerifyEmailRequest) => {
      const response = await api.post<VerifyEmailResponse>("/auth/login/email/verify", data);
      return response.data;
    },
    onSuccess: handleAuthSuccess,
  });

  //add addresses
  const addAddress = useMutation<any, Error, AddAddressRequest>({
    mutationFn: async (data: AddAddressRequest) => {
      const response = await api.post<any>("/auth/me/addresses", data);
      return response.data;
    },
     onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });



  return {
    registerMobile,
    verifyMobile,
    completeRegistration,
    resendOtp,
    loginWithEmail,
    sendMobileLoginOtp,
    verifyMobileLoginOtp,
    sendEmailVerificationOtp,
    verifyEmail,
    addAddress,
  };
};