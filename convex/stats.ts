import { query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { authComponent } from "./auth";

export const getAdvancedStats = query({
  handler: async (ctx) => {
    const identity = await authComponent.safeGetAuthUser(ctx);
    if (!identity) throw new ConvexError("Unauthorized");

    const adminEmail = process.env.ADMIN_EMAIL ?? "";
    if (!adminEmail || (identity.email ?? "").toLowerCase() !== adminEmail.toLowerCase()) {
      throw new ConvexError("Not an admin");
    }

    const posts = await ctx.db.query("posts").collect();
    const projects = await ctx.db.query("projects").collect();
    const comments = await ctx.db.query("comments").collect();
    const messages = await ctx.db.query("contacts").collect();

    // Calculate main totals
    const totalViews = posts.reduce((acc, p) => acc + (p.views ?? 0), 0);
    const totalLikes = posts.reduce((acc, p) => acc + (p.likes ?? 0), 0);

    // Calculate time-based stats
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now - i * oneDay);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }).reverse();

    // Helper for daily grouping
    const getDailyData = (items: any[], dateField: string = "createdAt") => {
      return last7Days.map(dayTimestamp => {
        const nextDay = dayTimestamp + oneDay;
        const count = items.filter(item => item[dateField] >= dayTimestamp && item[dateField] < nextDay).length;
        const label = new Date(dayTimestamp).toLocaleDateString(undefined, { weekday: 'short' });
        return { label, count, timestamp: dayTimestamp };
      });
    };

    const dailyPosts = getDailyData(posts);
    const dailyComments = getDailyData(comments);
    
    // For views, we'd ideally need a "views" table for historical per-day data.
    // Since we only have a total count on the post, we'll simulate daily views for the chart
    // or just show the current trend if we had a logs table. 
    // For now, let's provide the current totals per category.
    
    const latestPosts = await ctx.db.query("posts").order("desc").take(5);
    const latestComments = await ctx.db.query("comments").order("desc").take(5);
    const topViewedPosts = [...posts].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 5);
    const topLikedPosts = [...posts].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0)).slice(0, 5);

    return {
      totals: {
        posts: posts.length,
        projects: projects.length,
        comments: comments.length,
        views: totalViews,
        likes: totalLikes,
        messages: messages.length,
      },
      charts: {
        posts: dailyPosts,
        comments: dailyComments,
      },
      tables: {
        latestPosts,
        latestComments,
        topViewedPosts,
        topLikedPosts,
      }
    };
  },
});
