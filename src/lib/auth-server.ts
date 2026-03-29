import dotenv from "dotenv";
dotenv.config();

import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";
import { Pool } from "pg";
import { Resend } from "resend";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "",
  ssl: process.env.DATABASE_URL?.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : undefined,
});

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Auth will not work.");
}

const resend = new Resend(process.env.RESEND_API_KEY);
const appName = process.env.APP_NAME || "MyApp";
const emailFrom = process.env.EMAIL_FROM || `${appName} <onboarding@resend.dev>`;
const brandColor = process.env.BRAND_COLOR || "#0d9488";

const trustedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const maxLoginAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || "3", 10);
const lockoutWindowSeconds = parseInt(process.env.LOCKOUT_WINDOW_SECONDS || "900", 10);

const googleEnabled =
  process.env.ENABLE_GOOGLE_AUTH === "true" &&
  !!process.env.GOOGLE_CLIENT_ID &&
  !!process.env.GOOGLE_CLIENT_SECRET;

const twoFactorEnabled = process.env.ENABLE_2FA !== "false";

export const auth = betterAuth({
  appName,
  baseURL: process.env.APP_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "dev-secret-change-me",
  database: pool,
  plugins: twoFactorEnabled ? [twoFactor({ issuer: appName })] : [],
  socialProviders: googleEnabled
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : undefined,
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    storage: "memory",
    customRules: {
      "/sign-in/email": {
        window: lockoutWindowSeconds,
        max: maxLoginAttempts,
      },
      "/request-password-reset": {
        window: 60,
        max: 3,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      resend.emails
        .send({
          from: emailFrom,
          to: user.email,
          subject: `Reset your password – ${appName}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
              <h2 style="color: #171717; font-size: 22px; margin-bottom: 8px;">Reset your password</h2>
              <p style="color: #737373; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                Click the button below to set a new password for your ${appName} account.
              </p>
              <a href="${url}" style="display: inline-block; background: ${brandColor}; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px;">
                Reset Password
              </a>
              <p style="color: #a3a3a3; font-size: 13px; margin-top: 24px;">
                If you didn't request this, you can safely ignore this email.
              </p>
            </div>
          `,
        })
        .then((r) => console.log("Reset email sent:", r.data?.id || r.error))
        .catch((e) => console.error("Reset email failed:", e));
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      resend.emails
        .send({
          from: emailFrom,
          to: user.email,
          subject: `Verify your email – ${appName}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
              <h2 style="color: #171717; font-size: 22px; margin-bottom: 8px;">Verify your email</h2>
              <p style="color: #737373; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                Thanks for signing up for ${appName}! Click the button below to verify your email address.
              </p>
              <a href="${url}" style="display: inline-block; background: ${brandColor}; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px;">
                Verify Email
              </a>
              <p style="color: #a3a3a3; font-size: 13px; margin-top: 24px;">
                If you didn't create an account, you can safely ignore this email.
              </p>
            </div>
          `,
        })
        .then((r) => console.log("Verification email result:", r.data?.id || r.error))
        .catch((e) => console.error("Verification email failed:", e));
    },
  },
  trustedOrigins,
  trustedProxies: ["127.0.0.1", "::1"],
  advanced: {
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
});
