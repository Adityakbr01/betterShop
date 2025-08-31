// templates/whatsappTemplates.ts
export const whatsappTemplates = {
  otp_simple: (purpose: string, code: string) =>
    `🔐 Your OTP for *${purpose}* is *${code}*.  
⚡ It will expire in 5 minutes.`,

  otp_fancy: (purpose: string, code: string) =>
    `✨ Hello! ✨  

We received a request for *${purpose}*.  
Here is your secure code: 👉 *${code}* 👈  

⚠️ Do not share this code with anyone.`,

  otp_minimal: (purpose: string, code: string) =>
    `Code: *${code}*  
Use this to verify your *${purpose}*. Expires in 5 min.`
};
