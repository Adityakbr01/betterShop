"use client"

import { FC } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthMutations } from "@/api/useAuthApi";

import { toast } from "react-hot-toast"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/store/auth"

// ✅ Zod schema for OTP validation
const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^[0-9]+$/, "Only numbers allowed"),
})

type OtpFormData = z.infer<typeof otpSchema>

interface MobileLoginOtpFormProps {
  phoneNumber: string
  otp: string
  setOtp: (val: string) => void
  backToPhone: () => void
}

export const MobileLoginOtpForm: FC<MobileLoginOtpFormProps> = ({
  phoneNumber,
  otp,
  setOtp,
  backToPhone,
}) => {
  const { verifyMobileLoginOtp } = useAuthMutations()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp },
  })

  const onSubmit = async (data: OtpFormData) => {
    const toastId = toast.loading("Verifying OTP...")
    try {
      const res = await verifyMobileLoginOtp.mutateAsync({
        phoneNumber,
        otp: data.otp,
      })
      toast.success(res?.message ?? "Verified — signed in", { id: toastId })
      setOtp(data.otp) // ✅ persist otp in parent state
      useAuthStore.getState().setUser(res.data?.user)
      useAuthStore.getState().setAccessToken(res?.data?.accessToken!)
    } catch (error: any) {
      console.error("Mobile OTP verification failed:", error)
      toast.dismiss(toastId)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">
          Enter OTP sent to {phoneNumber}
        </label>
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

      <Button
        type="submit"
        className="w-full"
        disabled={verifyMobileLoginOtp.isPending}
      >
        {verifyMobileLoginOtp.isPending ? "Verifying..." : "Verify & Sign In"}
      </Button>

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={backToPhone}
      >
        Back to Phone Number
      </Button>
    </form>
  )
}
