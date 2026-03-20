"use server";

import { postSchema } from "./schemas/blog";
import { fetchAuthMutation } from "@/lib/auth-server";
import { api } from "../../convex/_generated/api";
import { redirect } from "next/navigation";
import z from "zod";
import { revalidatePath } from "next/cache";
import { Id } from "../../convex/_generated/dataModel";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

export async function createBlogAction(values: z.infer<typeof postSchema>) {
  try {
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      return { error: "Invalid form data" };
    }

    const { coverImage } = parsed.data;

    /* ---------------- minimal server-side guard ---------------- */

    if (!coverImage) {
      return { error: "Cover image is required" };
    }

    if (coverImage.size > MAX_FILE_SIZE) {
      return { error: "Image must be less than 1MB" };
    }

    if (!coverImage.type.startsWith("image/")) {
      return { error: "Invalid image type" };
    }

    /* ----------------------------------------------------------- */

    const uploadUrl = await fetchAuthMutation(
      api.posts.generateImageUploadUrl,
      {},
    );

    const uploadResult = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": coverImage.type,
      },
      body: coverImage,
    });

    if (!uploadResult.ok) {
      return { error: "Failed to upload image" };
    }

    const { storageId } = await uploadResult.json();

    await fetchAuthMutation(api.posts.createPost, {
      title: parsed.data.title,
      slug: parsed.data.slug,
      content: parsed.data.content,
      excerpt: parsed.data.excerpt,
      tags: parsed.data.tags,
      category: parsed.data.category,
      imageStorageId: storageId,
    });
  } catch {
    return { error: "Failed to create post" };
  }

  revalidatePath("/blog");
  return redirect("/dashboard/posts");
}

export async function publishPostAction(postId: Id<"posts">) {
  try {
    // Call the Convex mutation
    await fetchAuthMutation(api.posts.publishPost, { postId });

    // Revalidate blog pages to show the newly published post
    revalidatePath("/blog");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to publish post";
    console.error("Failed to publish post:", errorMessage);
    return { error: errorMessage };
  }
}

export async function createProjectAction(data: {
  title: string;
  slug: string;
  projectDetails: string;
  category?: string;
  liveUrl: string;
  githubUrl: string;
  technologies: string[];
  features: string[];
  imageStorageIds: Id<"_storage">[];
  seoTitle?: string;
  seoDescription?: string;
}) {
  try {
    await fetchAuthMutation(api.projects.createProject, data);

    revalidatePath("/dashboard/projects");

    return { success: true };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to create project";
    return { success: false, message: errorMessage };
  }
}

export async function publishProjectAction(projectId: Id<"projects">) {
  try {
    const res = await fetchAuthMutation(api.projects.publishProject, {
      projectId,
    });

    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");

    return res; // { status: "published" | "already_published" }
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Failed to publish project",
    };
  }
}
