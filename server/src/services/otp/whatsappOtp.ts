import twilio from "twilio";
import { whatsappTemplates } from "./templates/whatsappTemplates";
import { config } from "@/config";
import { ApiError } from "@/utils/ApiError";

if (!config.TWILIO_ACCOUNT_SID || !config.TWILIO_AUTH_TOKEN) {
  throw new ApiError(500, "❌ Twilio credentials not found");
}

const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

interface SendOtpOptions {
  identifier: string; // 10-digit mobile
  channel: "whatsapp";
  purpose: string;
  code: string;
  template?: keyof typeof whatsappTemplates; // ✅ new
}

export async function sendOtp({
  identifier,
  channel,
  purpose,
  code,
  template = "otp_simple" // ✅ default
}: SendOtpOptions) {
  try {
    if (channel === "whatsapp") {
      const toNumber = identifier.startsWith("whatsapp:")
        ? identifier
        : `whatsapp:+91${identifier}`;

      const body = whatsappTemplates[template](purpose, code);

      const message = await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: toNumber,
        body
      });
      return {
        success: true,
        sid: message.sid,
        message: `OTP sent via WhatsApp using ${template} template`
      };
    }
    return { success: false, message: "Unsupported channel" };
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    throw new ApiError(500, "Failed to send OTP");
    return {
      success: false,
      message: "Failed to send OTP",
      error
    };
  }
}
