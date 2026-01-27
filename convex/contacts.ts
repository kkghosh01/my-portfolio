import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";

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
    await ctx.db.insert("contacts", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });

    // Sending email (using convex Component)
    await resend.sendEmail(ctx, {
      from: "Website Contact <onboarding@resend.dev>",
      to: "kkghosh01737@gmail.com",
      subject: `New Message from ${args.name}`,
      html: `<p>Name: ${args.name}</p><p>Email: ${args.email}</p><p>Message: ${args.message}</p>`,

      replyTo: [args.email],
    });

    return { success: true };
  },
});

export const getMessages = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("contacts")
      .withIndex("by_created")
      .order("desc")
      .collect();
  },
});

export const replyToContact = mutation({
  args: { id: v.id("contacts"), replyText: v.string(), toEmail: v.string() },
  handler: async (ctx, args) => {
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
