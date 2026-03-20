import { query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { authComponent } from "./auth";

export const getDashboardStats = query({
  handler: async (ctx) => {
    const identity = await authComponent.safeGetAuthUser(ctx);
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const adminEmail = process.env.ADMIN_EMAIL ?? "";
    if (
      !adminEmail ||
      (identity.email ?? "").toLowerCase() !== adminEmail.toLowerCase()
    ) {
      throw new ConvexError("Not an admin");
    }

    // Get counts
    const totalPosts = await ctx.db.query("posts").collect();
    const totalProjects = await ctx.db.query("projects").collect();
    const totalMessages = await ctx.db.query("contacts").collect();

    // Calculate totals
    const totalViews = totalPosts.reduce((acc, post) => acc + (post.views ?? 0), 0);
    const totalLikes = totalPosts.reduce((acc, post) => acc + (post.likes ?? 0), 0);
    const newMessages = totalMessages.filter(m => m.status === "new").length;

    // Get recent activity (mix of posts, projects, messages)
    const recentPosts = await ctx.db
      .query("posts")
      .order("desc")
      .take(5);

    const recentProjects = await ctx.db
      .query("projects")
      .order("desc")
      .take(5);

    const recentMessages = await ctx.db
      .query("contacts")
      .order("desc")
      .take(5);

    // Combine and sort recent activity
    const activities = [
      ...recentPosts.map(p => ({
        id: p._id,
        type: "post" as const,
        title: p.title,
        status: p.status,
        date: p.createdAt,
      })),
      ...recentProjects.map(pr => ({
        id: pr._id,
        type: "project" as const,
        title: pr.title,
        status: pr.status,
        date: pr.createdAt,
      })),
      ...recentMessages.map(m => ({
        id: m._id,
        type: "message" as const,
        title: `Message from ${m.name}`,
        status: m.status,
        date: m.createdAt,
      })),
    ].sort((a, b) => b.date - a.date).slice(0, 10);

    return {
      stats: {
        posts: totalPosts.length,
        projects: totalProjects.length,
        messages: totalMessages.length,
        views: totalViews,
        likes: totalLikes,
        newMessages,
      },
      activities,
    };
  },
});
