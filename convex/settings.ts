import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { authComponent } from "./auth";

export const getSettings = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").first();
    if (!settings) {
      // Return default settings if none exist
      return {
        siteName: "Kishor's Code",
        siteDescription: "Full Stack Developer Portfolio",
        socialLinks: [
          { platform: "github", url: "https://github.com/kishor" },
          { platform: "linkedin", url: "https://linkedin.com/in/kishor" },
        ],
        seo: {
          title: "Kishor Kumar Ghosh | Portfolio",
          description: "Portfolio of Kishor Kumar Ghosh, a Full Stack Developer.",
          keywords: ["nextjs", "react", "convex", "portfolio"],
        },
      };
    }
    
    let logoUrl = null;
    if (settings.siteLogo) {
      logoUrl = await ctx.storage.getUrl(settings.siteLogo);
    }

    return { ...settings, logoUrl };
  },
});

export const updateSettings = mutation({
  args: {
    siteName: v.string(),
    siteDescription: v.string(),
    siteLogo: v.optional(v.id("_storage")),
    socialLinks: v.array(
      v.object({
        platform: v.string(),
        url: v.string(),
      }),
    ),
    seo: v.object({
      title: v.string(),
      description: v.string(),
      keywords: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await authComponent.safeGetAuthUser(ctx);
    if (!identity) throw new ConvexError("Unauthorized");

    const adminEmail = process.env.ADMIN_EMAIL ?? "";
    if (
      !adminEmail ||
      (identity.email ?? "").toLowerCase() !== adminEmail.toLowerCase()
    ) {
      throw new ConvexError("Not an admin");
    }

    const existing = await ctx.db.query("settings").first();
    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("settings", {
        ...args,
        updatedAt: now,
      });
    }
  },
});
