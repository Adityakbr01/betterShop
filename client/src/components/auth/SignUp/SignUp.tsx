"use client";

import { useState, useEffect } from "react";
import { MobileStep } from "./MobileStep";
import { OtpStep } from "./OtpStep";
import { CompleteStep } from "./CompleteStep";
import Link from "next/link";
import { CONFIG } from "@/config/_config";

export type SignUpStep = "mobile" | "otp" | "complete";

export const SignUp = () => {
  const [step, setStep] = useState<SignUpStep>("mobile");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Persist step on page refresh
  useEffect(() => {
    const savedStep = localStorage.getItem("signup_step") as SignUpStep;
    const savedPhone = localStorage.getItem("signup_phone");
    if (savedStep) setStep(savedStep);
    if (savedPhone) setPhoneNumber(savedPhone);
  }, []);

  useEffect(() => {
    localStorage.setItem("signup_step", step);
    localStorage.setItem("signup_phone", phoneNumber);
  }, [step, phoneNumber]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg space-y-6">
        {step === "mobile" && (
          <MobileStep setStep={setStep} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />
        )}
        {step === "otp" && (
          <OtpStep setStep={setStep} phoneNumber={phoneNumber} />
        )}
        {step === "complete" && (
          <CompleteStep setStep={setStep} phoneNumber={phoneNumber} />
        )}
      </div>
      {/* Sign up link */}
        <div className="text-center text-sm">
          <p className="text-gray-600">
            I have an account {" "}
            <Link
              href={CONFIG.CONSTANT.ROUTES.SIGNIN}
              className="text-black underline"
            >
              Sign In
            </Link>
          </p>
        </div>
    </div>
  );
};
