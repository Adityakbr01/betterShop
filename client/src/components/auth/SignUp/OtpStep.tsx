"use client";

import { FC } from "react";
import { useAuthMutations } from "@/api/useAuthApi";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { SignUpStep } from "./SignUp";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// 🔹 OTP validation schema
const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must only contain numbers"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface OtpStepProps {
  setStep: (step: SignUpStep) => void;
  phoneNumber: string;
}

export const OtpStep: FC<OtpStepProps> = ({ setStep, phoneNumber }) => {
  const { verifyMobile, resendOtp } = useAuthMutations();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (values: OtpFormValues) => {
    const toastId = toast.loading("Verifying OTP...");
    try {
      const res = await verifyMobile.mutateAsync({ phoneNumber, otp: values.otp });
      toast.success(res.message, { id: toastId });

      setStep("complete");
      localStorage.removeItem("signup_step");
    } catch (error: any) {
      console.error(error);
      toast.dismiss(toastId);
    }
  };

  const handleResend = async () => {
    const toastId = toast.loading("Resending OTP...");
    try {
      const res = await resendOtp.mutateAsync({ phoneNumber });
      toast.success(res.message, { id: toastId });
    } catch (error: any) {
      toast.dismiss(toastId);
    }
  };

  const handleBack = () => {
    setStep("mobile");
    localStorage.setItem("signup_step", "mobile");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Enter OTP</h2>
      <p className="text-sm text-gray-600 text-center">OTP sent to {phoneNumber}</p>

      <div>
        <Input
          type="text"
          placeholder="123456"
          maxLength={6}
          {...register("otp")}
        />
        {errors.otp && (
          <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={verifyMobile.isPending}>
        {verifyMobile.isPending ? "Verifying..." : "Verify OTP"}
      </Button>

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={handleResend}
        disabled={resendOtp.isPending}
      >
        {resendOtp.isPending ? "Resending..." : "Resend OTP"}
      </Button>

      <Button
        type="button"
        variant="ghost"
        className="w-full text-gray-600 hover:text-gray-900"
        onClick={handleBack}
      >
        Back
      </Button>
    </form>
  );
};
