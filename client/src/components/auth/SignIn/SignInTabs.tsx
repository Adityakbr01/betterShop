"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailLoginForm } from "./EmailLogin";
import { MobileLoginPhoneForm } from "./MobilePhoneForm";
import { MobileLoginOtpForm } from "./MobileOtpForm";

type MobileStep = "phone" | "otp";

export const LoginTabs = () => {
  const [mobileStep, setMobileStep] = useState<MobileStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <Tabs defaultValue="email" className="w-full">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="mobile">Mobile</TabsTrigger>
      </TabsList>

      <TabsContent value="email">
        <EmailLoginForm />
      </TabsContent>

      <TabsContent value="mobile">
        {mobileStep === "phone" ? (
          <MobileLoginPhoneForm
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            goToOtp={() => setMobileStep("otp")}
          />
        ) : (
          <MobileLoginOtpForm
            phoneNumber={phoneNumber}
            otp={otp}
            setOtp={setOtp}
            backToPhone={() => setMobileStep("phone")}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};
