import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import EditPostForm from "@/components/admin/edit-post-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const { id } = await params;

  const post = await client.query(api.posts.getPostById, {
    postId: id as Id<"posts">, // ✅ IMPORTANT
  });

  if (!post) {
    throw new Error("Post not found");
  }

  const normalizedPost = {
    title: post.title,
    slug: post.slug,
    content: post.content,
    tags: post.tags ?? [],
    category: post.category ?? "",
    excerpt: post.excerpt ?? "",
    seo: {
      metaTitle: post.seoTitle ?? "",
      metaDescription: post.seoDescription ?? "",
    },
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <EditPostForm
        post={normalizedPost}
        postId={post._id}
        status={post.status}
        imageStorageId={post.imageStorageId ?? undefined}
        imageUrl={post.imageUrl}
      />
    </div>
  );
}
