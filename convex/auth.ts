import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";
import { betterAuth } from "better-auth/minimal";
import authConfig from "./auth.config";
import { v } from "convex/values";
import { Resend } from "@convex-dev/resend";

const siteUrl = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";

const resend = new Resend(components.resend, {
  testMode: false,
});

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    advanced: {
      useSecureCookies: true,
    },
    trustedOrigins: [
      "https://my-portfolio-cjjsicfel-kishor-kumar-ghoshs-projects.vercel.app",
      "https://*.vercel.app",
    ],
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,

      async signUp({ email }: { email: string }) {
        const adminEmail =
          process.env.ADMIN_EMAIL ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        if (!adminEmail) {
          console.error(
            "ADMIN_EMAIL not set in environment — blocking signups",
          );
          return false;
        }
        return (email ?? "").toLowerCase() === adminEmail.toLowerCase();
      },

      async signIn({ email }: { email: string }) {
        const adminEmail =
          process.env.ADMIN_EMAIL ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        if (!adminEmail) {
          console.error(
            "ADMIN_EMAIL not set in environment — blocking signins",
          );
          return false;
        }
        return (email ?? "").toLowerCase() === adminEmail.toLowerCase();
      },

      resetPasswordTokenExpiresIn: 15 * 60 * 1000,
      revokeSessionsOnPasswordReset: true,

      async sendResetPassword({ user, url }) {
        try {
          if (!user.email) {
            return;
          }

          const adminEmail = process.env.ADMIN_EMAIL;
          if (
            adminEmail &&
            user.email.toLowerCase() !== adminEmail.toLowerCase()
          ) {
            // Only allow password resets for the configured admin email if set.
            return;
          }

          await resend.sendEmail(ctx as any, {
            from: "Admin Password Reset <onboarding@resend.dev>",
            to: user.email,
            subject: "Reset your admin password",
            html: `<p>You requested a password reset for the admin dashboard.</p><p><a href="${url}">Click here to reset your password</a>. This link expires in 15 minutes.</p>`,
          });
        } catch (error) {
          console.error("Failed to send reset password email", error);
        }
      },
    },
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex({ authConfig }),
    ],
  });
};

// Export a public query to get the currently authenticated user
export const getCurrentUser = query({
  handler: async (ctx) => {
    return await authComponent.safeGetAuthUser(ctx);
  },
});
