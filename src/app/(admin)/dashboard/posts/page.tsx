// app/dashboard/posts/page.tsx
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "../../../../../convex/_generated/api";
import PostsTable from "@/components/admin/posts-table";

export default async function AdminPostsPage() {
  const posts = await fetchAuthQuery(api.posts.getAdminPosts, {});

  const formattedPosts = posts.map((post) => ({
    ...post,
    createdAtFormatted: new Date(post.createdAt).toISOString().slice(0, 10),
  }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Posts</h1>
      </div>

      <PostsTable posts={formattedPosts} />
    </div>
  );
}
