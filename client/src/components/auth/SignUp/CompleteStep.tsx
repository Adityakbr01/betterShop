"use client";

import { FC } from "react";
import { useAuthMutations } from "@/api/useAuthApi";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/auth";

const completeSchema = z
  .object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email"),
  })

type CompleteForm = z.infer<typeof completeSchema>;

interface CompleteStepProps {
  phoneNumber: string;
  setStep: (step: "mobile" | "otp" | "complete") => void;
}

export const CompleteStep: FC<CompleteStepProps> = ({ phoneNumber, setStep }) => {
  const { completeRegistration } = useAuthMutations();

  const form = useForm<CompleteForm>({
    resolver: zodResolver(completeSchema),
    defaultValues: {
      name: "",
      email: ""
    },
  });

  const onSubmit = async (data: CompleteForm) => {
    const toastId = toast.loading("Creating account...");
    try {
      const res = await completeRegistration.mutateAsync({
        phoneNumber,
        name: data.name,
        email: data.email,
      });
      toast.success(res.message || "Account created successfully", { id: toastId });
      localStorage.removeItem("signup_email");
      localStorage.removeItem("signup_phone");
      localStorage.removeItem("signup_step");
      useAuthStore.getState().setUser(res.data?.user)
      useAuthStore.getState().setAccessToken(res?.data?.accessToken!)
    } catch {
      toast.dismiss(toastId);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Complete Registration</h2>

      <Input placeholder="Name" {...form.register("name")} />
      {form.formState.errors.name && (
        <p className="text-red-500 text-sm">
          {form.formState.errors.name.message}
        </p>
      )}

      <Input type="email" placeholder="Email" {...form.register("email")} />
      {form.formState.errors.email && (
        <p className="text-red-500 text-sm">
          {form.formState.errors.email.message}
        </p>
      )}


      <Button
        type="submit"
        className="w-full"
        disabled={completeRegistration.isPending}
      >
        {completeRegistration.isPending
          ? "Creating Account..."
          : "Complete Registration"}
      </Button>

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={() => setStep("otp")}
      >
        Back
      </Button>
    </form>
  );
};
