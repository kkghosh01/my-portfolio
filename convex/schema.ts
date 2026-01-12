import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    // Core content
    title: v.string(),
    slug: v.string(), // unique
    content: v.string(), // full markdown / html / rich text
    excerpt: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),

    // Meta
    tags: v.array(v.string()),
    category: v.optional(v.string()),

    // Status & publishing
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived")
    ),

    // Author
    authorId: v.string(),
    authorName: v.string(),

    // Timestamps
    createdAt: v.number(), // Date.now()
    updatedAt: v.number(),
    publishedAt: v.optional(v.number()),
    views: v.number(),
    likes: v.number(),

    // SEO (future ready)
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
  })
    // slug uniqueness
    .index("by_slug", ["slug"])
    // author posts
    .index("by_author", ["authorId"])
    // published feed
    .index("by_status", ["status"]),

  likes: defineTable({
    userId: v.string(),
    postId: v.id("posts"),
  })
    .index("by_user_post", ["userId", "postId"])
    .index("by_post", ["postId"]),
});
