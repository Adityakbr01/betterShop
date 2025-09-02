"use client"

import { FC } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthMutations } from "@/api/useAuthApi";

import { toast } from "react-hot-toast"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// ✅ Zod schema for phone number validation
const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^[0-9]+$/, "Only numbers allowed"),
})

type PhoneFormData = z.infer<typeof phoneSchema>

interface MobileLoginPhoneFormProps {
  phoneNumber: string
  setPhoneNumber: (val: string) => void
  goToOtp: () => void
}

export const MobileLoginPhoneForm: FC<MobileLoginPhoneFormProps> = ({
  phoneNumber,
  setPhoneNumber,
  goToOtp,
}) => {
  const { sendMobileLoginOtp } = useAuthMutations()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber },
  })

  const onSubmit = async (data: PhoneFormData) => {
    const toastId = toast.loading("Sending OTP...")
    try {
      const res = await sendMobileLoginOtp.mutateAsync({
        phoneNumber: data.phoneNumber,
      })
      toast.success(res?.message ?? "OTP sent", { id: toastId })
      setPhoneNumber(data.phoneNumber) // ✅ keep parent state in sync
      goToOtp()
    } catch (error: any) {
      console.error("Send mobile OTP failed:", error)
      toast.dismiss(toastId)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Phone Number</label>
        <Input
          type="tel"
          placeholder="9876543210"
          {...register("phoneNumber")}
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={sendMobileLoginOtp.isPending}
      >
        {sendMobileLoginOtp.isPending ? "Sending..." : "Send OTP"}
      </Button>
    </form>
  )
}
