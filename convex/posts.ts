import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { authComponent } from "./auth";

/**
 * CREATE POST (DRAFT)
 */
export const createPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    tags: v.array(v.string()),
    category: v.optional(v.string()),
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // 🔐 Auth check
    const identity = await authComponent.safeGetAuthUser(ctx);
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    // // 🔐 Admin check (single-admin system)
    // const adminEmail = process.env.ADMIN_EMAIL ?? "";
    // if (
    //   !adminEmail ||
    //   (identity.email ?? "").toLowerCase() !== adminEmail.toLowerCase()
    // ) {
    //   throw new ConvexError("Not an admin");
    // }

    // 🔁 Slug uniqueness check
    const existing = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      throw new ConvexError("Slug already exists");
    }

    const now = Date.now();

    // 📝 Insert draft post
    const postId = await ctx.db.insert("posts", {
      title: args.title,
      slug: args.slug,
      content: args.content,
      excerpt: args.excerpt,
      tags: args.tags,
      category: args.category,
      imageStorageId: args.imageStorageId,

      status: "draft",
      authorId: identity._id,
      authorName: identity.name,

      createdAt: now,
      updatedAt: now,
      views: 0,
      likes: 0,
    });

    return postId;
  },
});

/**
 * PUBLISH POST
 */
export const publishPost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, { postId }) => {
    const identity = await authComponent.safeGetAuthUser(ctx);
    console.log(identity);
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    // const adminEmail = process.env.ADMIN_EMAIL ?? "";
    // if (
    //   !identity ||
    //   !adminEmail ||
    //   (identity.email ?? "").toLowerCase() !== adminEmail.toLowerCase()
    // ) {
    //   throw new ConvexError("Unauthorized");
    // }

    const post = await ctx.db.get(postId);
    if (!post) {
      throw new ConvexError("Post not found");
    }

    // If already published, just update the timestamp and return
    if (post.status === "published") {
      await ctx.db.patch(postId, {
        updatedAt: Date.now(),
      });
      return;
    }

    await ctx.db.patch(postId, {
      status: "published",
      publishedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getAdminPosts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await authComponent.safeGetAuthUser(ctx);
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
    // const adminEmail = process.env.ADMIN_EMAIL ?? "";
    // if (
    //   !identity ||
    //   !adminEmail ||
    //   (identity.email ?? "").toLowerCase() !== adminEmail.toLowerCase()
    // ) {
    //   throw new ConvexError("Unauthorized");
    // }

    const posts = ctx.db.query("posts").order("desc").collect();
    return await Promise.all(
      (await posts).map(async (post) => {
        const resolvedImageUrl =
          post.imageStorageId !== undefined
            ? await ctx.storage.getUrl(post.imageStorageId)
            : null;

        return {
          ...post,
          imageUrl: resolvedImageUrl,
        };
      })
    );
  },
});

export const getPublishedPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();

    return Promise.all(
      posts.map(async (post) => ({
        ...post,
        imageUrl: post.imageStorageId
          ? await ctx.storage.getUrl(post.imageStorageId)
          : null,
      }))
    );
  },
});

export const archivePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const identity = await authComponent.safeGetAuthUser(ctx);
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
    await ctx.db.patch(postId, {
      status: "archived",
      updatedAt: Date.now(),
    });
  },
});

export const getPostById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const post = await ctx.db.get(postId);
    if (!post) return null;

    const imageUrl = post.imageStorageId
      ? await ctx.storage.getUrl(post.imageStorageId)
      : null;

    return {
      ...post,
      imageUrl,
    };
  },
});

// convex/posts.ts

export const deleteImage = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    const identity = await authComponent.safeGetAuthUser(ctx);
    if (!identity) throw new ConvexError("Unauthorized");

    try {
      await ctx.storage.delete(storageId);
    } catch (error) {
      // Storage file may have already been deleted, ignore the error
      console.log(`Storage file ${storageId} not found, skipping deletion`);
    }
  },
});

export const updatePost = mutation({
  args: {
    postId: v.id("posts"),
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    category: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { postId, ...data } = args;
    await ctx.db.patch(postId, {
      ...data,
      updatedAt: Date.now(),
    });
  },
});

export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await authComponent.safeGetAuthUser(ctx);
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const getPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (!post) return null;

    return {
      ...post,
      imageUrl: post.imageStorageId
        ? await ctx.storage.getUrl(post.imageStorageId)
        : null,
    };
  },
});

export const incrementView = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const post = await ctx.db.get(postId);
    if (!post) return;
    await ctx.db.patch(postId, {
      views: (post.views ?? 0) + 1,
    });
  },
});

export const toggleLike = mutation({
  args: {
    postId: v.id("posts"),
    anonymousId: v.string(),
  },
  handler: async (ctx, { postId, anonymousId }) => {
    const post = await ctx.db.get(postId);
    if (!post) throw new Error("Post not found");

    const existing = await ctx.db
      .query("likes")
      .withIndex("by_user_post", (q) =>
        q.eq("userId", anonymousId).eq("postId", postId)
      )
      .unique();

    let liked: boolean;
    let newLikes: number;

    if (existing) {
      // User already liked - remove the like
      await ctx.db.delete(existing._id);
      newLikes = Math.max(0, post.likes - 1);
      liked = false;
    } else {
      // User hasn't liked - add the like
      await ctx.db.insert("likes", {
        userId: anonymousId,
        postId,
      });
      newLikes = post.likes + 1;
      liked = true;
    }

    // Update post likes count
    await ctx.db.patch(postId, {
      likes: newLikes,
    });

    return {
      liked,
      likes: newLikes,
    };
  },
});
