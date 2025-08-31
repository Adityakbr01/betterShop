// ============================
// Types
// ============================
export interface RegisterWithMobileRequest {
  mobileNumber: string;
}

export interface VerifyMobileRequest {
  mobileNumber: string;
  otp: string;
}

export interface CompleteRegistrationRequest {
  mobileNumber: string;
  name: string;
  email: string;
  password: string;
}

export interface RegistrationResult {
  success: boolean;
  message: string;
  data?: {
    userId?: string;
    token?: string;
    user?: any;
    tempToken?: string;
    remainingAttempts?: number;
  };
  error?: string;
}

export interface RegisterMobileInput {
  mobileNumber: string;
}

export interface VerifyMobileInput {
  mobileNumber: string;
  otp: string;
}

export interface CompleteRegistrationInput {
  mobileNumber: string;
  name: string;
  email: string;
}
