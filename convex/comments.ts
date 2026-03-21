import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    name: v.string(),
    email: v.string(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const commentId = await ctx.db.insert("comments", {
      postId: args.postId,
      name: args.name,
      email: args.email,
      comment: args.comment,
      createdAt: Date.now(),
    });
    return commentId;
  },
});

export const getCommentsByPost = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();
  },
});
