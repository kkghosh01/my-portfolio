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

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,

      // 🔐 SIGN UP GUARD (most important)
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

      // 🔐 SIGN IN GUARD (extra safety)
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
