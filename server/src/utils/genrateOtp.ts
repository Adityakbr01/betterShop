import { config } from "@/config";

export function generateOtp({
  length = config.DEFAOULT_OTP_LENGTH as number
}: {
  length?: number;
}) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}
