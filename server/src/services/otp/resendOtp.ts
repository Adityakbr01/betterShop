import { config } from '@/config';
import { Resend } from 'resend';

// Validate API key
if (!config.RESEND_API_KEY) {
  throw new Error('❌ Resend API key not found');
}

const resend = new Resend(config.RESEND_API_KEY);

export enum emailPurposes {
  registration = 'Registration',
  passwordReset = 'Password Reset',
  emailVerification = 'Email Verification',
  loginAlert = 'Login Alert',
  accountDeactivation = 'Account Deactivation',
  accountReactivation = 'Account Reactivation',
  twoFactorAuth = 'Two-Factor Authentication',
  orderConfirmation = 'Order Confirmation',
  orderShipped = 'Order Shipped',
  orderDelivered = 'Order Delivered',
  orderCancelled = 'Order Cancelled',
  newsletter = 'Newsletter',
  promotion = 'Promotion',
  feedbackRequest = 'Feedback Request',
  supportReply = 'Support Reply',
  adminAlert = 'Admin Alert',
}

export async function sendOTPEmail({
  to,
  otp,
  recipientName = 'User',
  purpose = emailPurposes.emailVerification,
  expiresInMinutes = 10,
}: {
  to: string;
  otp: string;
  recipientName?: string;
  purpose?: emailPurposes;
  expiresInMinutes?: number;
}) {
  try {
    const htmlContent = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <style>
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        mso-font-alt: 'Arial';
        src: url(https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap) format('woff2');
      }
      * {
        font-family: 'Inter', Arial;
      }
    </style>
  </head>
  <body style="background-color:#000;font-family:Inter, Arial, sans-serif;padding:40px 0;">
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
      style="background-color:#fff;border-radius:12px;max-width:600px;margin:auto;padding:48px;border:1px solid #e5e7eb">
      <tbody>
        <tr>
          <td>
            <!-- Logo + Heading -->
            <table width="100%" style="text-align:center;margin-bottom:40px">
              <tr>
                <td>
                  <div style="width:72px;height:72px;background:#000;border-radius:9999px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center">
                    <p style="color:#fff;font-size:32px;font-weight:600;margin:0">🛍️</p>
                  </div>
                  <h1 style="font-size:32px;font-weight:700;color:#000;margin:0 0 8px;letter-spacing:-0.025em">betterShop.in</h1>
                  <p style="color:#4b5563;font-size:16px;margin:0;font-weight:500">Secure Verification Code</p>
                </td>
              </tr>
            </table>

            <!-- Greeting + Message -->
            <p style="font-size:20px;color:#000;margin:0 0 16px;font-weight:600">Hello ${recipientName},</p>
            <p style="font-size:16px;color:#374151;line-height:26px;margin:0 0 24px">
              We received a request for <strong style="color:#000">${purpose}</strong> on your betterShop.in account. 
              Please use the verification code below to complete this process securely.
            </p>

            <!-- OTP Box -->
            <div style="background:#f9fafb;border:3px solid #000;border-radius:16px;padding:40px;text-align:center;margin-bottom:36px">
              <p style="font-size:14px;color:#4b5563;margin:0 0 12px;text-transform:uppercase;letter-spacing:2px;font-weight:600">Verification Code</p>
              <p style="font-size:48px;font-weight:700;color:#000;margin:0;letter-spacing:12px;font-family:SF Mono, Monaco, Consolas, monospace">${otp}</p>
              <p style="font-size:14px;color:#6b7280;margin:12px 0 0;font-weight:500">Expires in ${expiresInMinutes} minutes</p>
            </div>

            <!-- Security Guidelines -->
            <div style="background:#f3f4f6;border-left:6px solid #000;padding:20px;border-radius:0 12px 12px 0;margin-bottom:36px">
              <p style="font-size:16px;color:#000;margin:0 0 8px;font-weight:600">🔒 Security Guidelines</p>
              <p style="font-size:14px;color:#374151;margin:0;line-height:22px">
                • This code is valid for ${expiresInMinutes} minutes only<br/>
                • Never share this code with anyone, including betterShop.in staff<br/>
                • If you didn’t request this verification, please secure your account immediately
              </p>
            </div>

            <!-- Footer -->
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:36px 0" />
            <p style="font-size:16px;color:#000;font-weight:600;margin:0 0 8px;text-align:center">betterShop.in</p>
            <p style="font-size:14px;color:#4b5563;margin:0 0 8px;text-align:center">This is an automated security message. Please do not reply to this email.</p>
            <p style="font-size:12px;color:#6b7280;margin:0 0 4px;text-align:center">© 2025 betterShop.in. All rights reserved.</p>
            <p style="font-size:12px;color:#6b7280;margin:0;text-align:center">Building better shopping experiences across India</p>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;

    const { data, error } = await resend.emails.send({
      from: config.FROM_EMAIL,
      to: [to],
      subject: `Your OTP for ${purpose}`,
      html: htmlContent,
    });

    if (error) {
      throw new Error(`Resend error: ${error.message}`);
    }
    console.log(`✅ ${purpose} OTP email sent:`, data.id);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error(`❌ Error sending OTP email for ${purpose}:`, error);
    throw error;
  }
}
