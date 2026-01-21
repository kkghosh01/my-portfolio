import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";

// convex/projects.ts

export const createProject = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    projectDetails: v.string(),

    category: v.optional(v.string()),
    liveUrl: v.string(),
    githubUrl: v.optional(v.string()),

    technologies: v.optional(v.array(v.string())),
    features: v.optional(v.array(v.string())),

    imageStorageIds: v.optional(v.array(v.id("_storage"))),

    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const identity = await authComponent.safeGetAuthUser(ctx);
    if (!identity) throw new ConvexError("Unauthorized");

    const existing = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) throw new ConvexError("Slug already exists");

    const now = Date.now();

    return await ctx.db.insert("projects", {
      title: args.title,
      slug: args.slug,
      projectDetails: args.projectDetails,

      category: args.category,
      liveUrl: args.liveUrl,
      githubUrl: args.githubUrl,

      technologies: args.technologies ?? [],
      features: args.features ?? [],

      imageStorageIds: args.imageStorageIds,

      seoTitle: args.seoTitle,
      seoDescription: args.seoDescription,

      status: "draft",
      authorId: identity._id,
      authorName: identity.name ?? "Admin",

      createdAt: now,
      updatedAt: now,
    });
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const publishProject = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const identity = await authComponent.safeGetAuthUser(ctx);
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const project = await ctx.db.get(projectId);
    if (!project) {
      throw new ConvexError("Project not found");
    }

    // already published → no-op but informative
    if (project.status === "published") {
      await ctx.db.patch(projectId, {
        updatedAt: Date.now(),
      });

      return {
        status: "already_published",
      };
    }

    await ctx.db.patch(projectId, {
      status: "published",
      publishedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      status: "published",
    };
  },
});

export const getAdminProjects = query({
  args: {},
  handler: async (ctx) => {
    const identity = await authComponent.safeGetAuthUser(ctx);
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const projects = await ctx.db.query("projects").order("desc").collect();

    return await Promise.all(
      projects.map(async (project) => {
        let imageUrls: string[] = [];

        if (project.imageStorageIds && project.imageStorageIds.length > 0) {
          imageUrls = await Promise.all(
            project.imageStorageIds.map(async (storageId) => {
              const url = await ctx.storage.getUrl(storageId);
              return url!;
            }),
          );
        }

        return {
          ...project,
          imageUrls, // array of resolved URLs
        };
      }),
    );
  },
});

export const getPublishedProjects = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();

    return await Promise.all(
      projects.map(async (project) => {
        const imageUrls =
          project.imageStorageIds && project.imageStorageIds.length > 0
            ? await Promise.all(
                project.imageStorageIds.map((id) => ctx.storage.getUrl(id)),
              )
            : [];

        return {
          ...project,
          imageUrls,
        };
      }),
    );
  },
});

export const getProjectById = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    if (!project) return null;

    const imageUrls = project.imageStorageIds
      ? (
          await Promise.all(
            project.imageStorageIds.map((id) => ctx.storage.getUrl(id)),
          )
        ).filter((url): url is string => url !== null)
      : [];

    return {
      ...project,
      imageUrls, // type => string[]
    };
  },
});

export const getProjectBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .filter((q) => q.eq(q.field("status"), "published"))
      .first();

    if (!project) return null;

    const imageUrls = (
      await Promise.all(
        (project.imageStorageIds ?? []).map((id) => ctx.storage.getUrl(id)),
      )
    ).filter((url): url is string => Boolean(url)); // 👈 KEY LINE

    return {
      ...project,
      imageUrls,
    };
  },
});

export const archiveProject = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const identity = await authComponent.safeGetAuthUser(ctx);
    if (!identity) throw new ConvexError("Unauthorized");

    const project = await ctx.db.get(projectId);
    if (!project) throw new ConvexError("Project not found");

    await ctx.db.patch(projectId, {
      status: "archived",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const deleteImage = mutation({
  args: {
    projectId: v.id("projects"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { projectId, storageId }) => {
    const identity = await authComponent.safeGetAuthUser(ctx);
    if (!identity) throw new ConvexError("Unauthorized");

    const project = await ctx.db.get(projectId);
    if (!project) throw new ConvexError("Project not found");

    const updatedImages =
      project.imageStorageIds?.filter((id) => id !== storageId) ?? [];

    await ctx.storage.delete(storageId);

    await ctx.db.patch(projectId, {
      imageStorageIds: updatedImages,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),

    title: v.string(),
    projectDetails: v.string(),
    category: v.optional(v.string()),
    liveUrl: v.string(),

    imageStorageIds: v.optional(v.array(v.id("_storage"))),

    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("published"),
        v.literal("archived"),
      ),
    ),

    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Unauthorized");

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new ConvexError("Project not found");

    // 🔐 ownership check (important)
    if (project.authorId !== user._id) {
      throw new ConvexError("Forbidden");
    }

    const now = Date.now();

    await ctx.db.patch(args.projectId, {
      title: args.title,
      projectDetails: args.projectDetails,
      category: args.category,
      liveUrl: args.liveUrl,

      ...(args.imageStorageIds !== undefined && {
        imageStorageIds: args.imageStorageIds,
      }),

      ...(args.status && {
        status: args.status,
        publishedAt:
          args.status === "published" && !project.publishedAt
            ? now
            : project.publishedAt,
      }),

      ...(args.seoTitle !== undefined && { seoTitle: args.seoTitle }),
      ...(args.seoDescription !== undefined && {
        seoDescription: args.seoDescription,
      }),

      updatedAt: now,
    });

    return { success: true };
  },
});

export const getRecentProjects = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 3 }) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit);

    return Promise.all(
      projects.map(async (project) => {
        const imageUrls = project.imageStorageIds
          ? (
              await Promise.all(
                project.imageStorageIds.map((id) => ctx.storage.getUrl(id)),
              )
            ).filter((url): url is string => Boolean(url))
          : [];

        return {
          ...project,
          imageUrls,
        };
      }),
    );
  },
});
