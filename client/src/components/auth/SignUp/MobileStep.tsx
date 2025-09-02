"use client";

import { FC } from "react";
import { useAuthMutations } from "@/api/useAuthApi";

import { SignUpStep } from "./SignUp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number is too short")
    .regex(/^\+?[1-9]\d{9,14}$/, "Enter a valid phone number"),
});

type PhoneForm = z.infer<typeof phoneSchema>;

interface MobileStepProps {
  setStep: (step: SignUpStep) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
}

export const MobileStep: FC<MobileStepProps> = ({ setStep, setPhoneNumber }) => {
  const { registerMobile } = useAuthMutations();

  const form = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: "" },
  });

  const onSubmit = async (data: PhoneForm) => {
    const toastId = toast.loading("Sending OTP...");
    try {
      const res = await registerMobile.mutateAsync(data);
      toast.success(res.message, { id: toastId });
      setPhoneNumber(data.phoneNumber);
      setStep("otp");
    } catch {
      toast.dismiss(toastId);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Sign Up</h2>
      <Input
        type="tel"
        placeholder="+1234567890"
        {...form.register("phoneNumber")}
      />
      {form.formState.errors.phoneNumber && (
        <p className="text-red-500 text-sm">
          {form.formState.errors.phoneNumber.message}
        </p>
      )}
      <Button
        type="submit"
        className="w-full"
        disabled={registerMobile.isPending}
      >
        {registerMobile.isPending ? "Sending..." : "Send OTP"}
      </Button>
    </form>
  );
};
