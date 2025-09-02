"use client";

import { useAuthMutations } from "@/api/useAuthApi";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import toast from "react-hot-toast";

const EmailDialog = ({
  open,
  setOpen,
  control,
  handleSubmit,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  control: any;
  handleSubmit: any;
}) => {

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const { sendEmailVerificationOtp, verifyEmail } = useAuthMutations();
  const user = useAuthStore((state) => state.user); // ✅ reactive
  const setUser = useAuthStore((state) => state.setUser); // ✅ reactive



  const handleSendOtp = async () => {
    const email = control._formValues.email;
    const toastId = toast.loading("Sending OTP...");
    try {
      const res = await sendEmailVerificationOtp.mutateAsync({ email });
      setOtpSent(true);
      toast.success(res.message || "OTP sent to your email", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP", { id: toastId });
    }
  };

  const handleVerifyOtp = async () => {
    const email = control._formValues.email;
    const toastId = toast.loading("Verifying OTP...");
    try {
      const res = await verifyEmail.mutateAsync({ email, otp });
      setOpen(false);
      setOtpSent(false);
      setOtp("");
      // After verifying OTP successfully, update localStorage user object
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user) {
        user.isEmailVerified = true;
        localStorage.setItem('user', JSON.stringify(user));  // Update the user object in localStorage
      }
      setUser({ ...user, isEmailVerified: true }); // Update the Zustand store
      toast.success(res.message || "Email verified successfully", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Failed to verify OTP", { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        setOtpSent(false);
        setOtp("");
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Email</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(() => { })}>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1">
                <Label>Email</Label>
                <Input
                  {...field}
                  placeholder="Enter your email"
                  disabled={sendEmailVerificationOtp.isPending || verifyEmail.isPending}
                />
                {fieldState.error && (
                  <span className="text-red-500 text-sm">{fieldState.error.message}</span>
                )}
              </div>
            )}
          />
          {otpSent && (
            <div className="flex flex-col gap-1 mt-4">
              <Label>OTP</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                disabled={verifyEmail.isPending}
              />
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setOtpSent(false);
                setOtp("");
              }}
              type="button"
              disabled={sendEmailVerificationOtp.isPending || verifyEmail.isPending}
            >
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            {otpSent ? (
              <Button
                type="button"
                onClick={handleVerifyOtp}
                disabled={verifyEmail.isPending || !otp}
              >
                {verifyEmail.isPending ? (
                  <LoadingSpinner />
                ) : (
                  <Check className="w-4 h-4 mr-1" />
                )}
                Verify OTP
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSendOtp}
                disabled={sendEmailVerificationOtp.isPending}
              >
                {sendEmailVerificationOtp.isPending ? (
                  <LoadingSpinner />
                ) : (
                  <Check className="w-4 h-4 mr-1" />
                )}
                Send OTP
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;