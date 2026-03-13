import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";
import { authComponent } from "./auth";

const resend = new Resend(components.resend, {
  testMode: false,
});

export const createContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Simple rate limit: max 5 messages per email per hour
    const ONE_HOUR_MS = 60 * 60 * 1000;
    const windowStart = now - ONE_HOUR_MS;

    const recentFromEmail = await ctx.db
      .query("contacts")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.gte(q.field("createdAt"), windowStart))
      .take(6);

    if (recentFromEmail.length >= 5) {
      throw new ConvexError(
        "Too many messages from this email. Please try again later.",
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL ?? "noreply@example.com";

    await ctx.db.insert("contacts", {
      ...args,
      status: "new",
      createdAt: now,
    });

    // Sending email (using convex Component)
    await resend.sendEmail(ctx, {
      from: "Website Contact <onboarding@resend.dev>",
      to: adminEmail,
      subject: `New Message from ${args.name}`,
      html: `<p>Name: ${args.name}</p><p>Email: ${args.email}</p><p>Message: ${args.message}</p>`,

      replyTo: [args.email],
    });

    return { success: true };
  },
});

export const getMessages = query({
  handler: async (ctx) => {
    const identity = await authComponent.safeGetAuthUser(ctx);
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db
      .query("contacts")
      .withIndex("by_created")
      .order("desc")
      .take(50);
  },
});

export const replyToContact = mutation({
  args: { id: v.id("contacts"), replyText: v.string(), toEmail: v.string() },
  handler: async (ctx, args) => {
    const identity = await authComponent.safeGetAuthUser(ctx);
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    // Sending email
    await resend.sendEmail(ctx, {
      from: "Support <onboarding@resend.dev>",
      to: [args.toEmail],
      subject: "Response to your inquiry",
      text: args.replyText,
    });

    // Update status
    await ctx.db.patch(args.id, {
      status: "replied", // status change
      replyMessage: args.replyText,
      repliedAt: Date.now(),
    });
  },
});

export const getUnreadCount = query({
  handler: async (ctx) => {
    const identity = await authComponent.safeGetAuthUser(ctx);
    if (!identity) {
      // Avoid noisy "Unauthorized" errors during initial client/session load.
      // This query is used for UI badges; returning 0 leaks nothing.
      return 0;
    }

    const unreadMessages = await ctx.db
      .query("contacts")
      .withIndex("by_status", (q) => q.eq("status", "new"))
      .collect();
    return unreadMessages.length;
  },
});
