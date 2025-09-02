"use client"

import { FC, useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthMutations } from "@/api/useAuthApi";
import { toast } from "react-hot-toast"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "motion/react"
import gsap from "gsap"
import { useAuthStore } from "@/store/auth"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export const EmailLoginForm: FC = () => {
  const { loginWithEmail } = useAuthMutations()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const eyeRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // GSAP animation for eye icon
  useEffect(() => {
    if (eyeRef.current) {
      gsap.fromTo(
        eyeRef.current,
        { scale: 0.8, rotate: isPasswordVisible ? -20 : 20 },
        { scale: 1, rotate: 0, duration: 0.4, ease: "back.out(2)" }
      )
    }
  }, [isPasswordVisible])

  // Add outline animation when focused
  useEffect(() => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        borderColor: isFocused ? "hsl(215, 20.2%, 65.1%)" : "hsl(215, 27.9%, 16.9%)",
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }, [isFocused])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    const toastId = toast.loading("Signing in...")
    try {
      const res = await loginWithEmail.mutateAsync(data)
      toast.success(res?.message ?? "Signed in successfully", { id: toastId })
      useAuthStore.getState().setUser(res.data?.user)
      useAuthStore.getState().setAccessToken(res?.data?.accessToken!)
    } catch (error: any) {
      console.error("Email login failed:", error)
      toast.dismiss(toastId)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium mb-1.5">Email</label>
        <Input
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className="border border-black"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field with Enhanced Toggle */}
      <div>
        <label className="block text-sm font-medium mb-1.5">Password</label>
        <div
          ref={containerRef}
          className="relative flex items-center rounded-md border border-input"
        >
          <Input
            type={isPasswordVisible ? "text" : "password"}
            placeholder="••••••••"
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            {...register("password")}
          />

          {/* Enhanced Toggle Button */}
          <button
            type="button"
            className="absolute right-3 h-5 w-5 text-muted-foreground/70 hover:text-foreground transition-colors focus:outline-none  cursor-pointer rounded-sm"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            <AnimatePresence mode="wait">
              {isPasswordVisible ? (
                <motion.svg
                  key="visible"
                  ref={eyeRef}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="hidden"
                  ref={eyeRef}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full"
        disabled={loginWithEmail.isPending}
      >
        {loginWithEmail.isPending ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  )
}