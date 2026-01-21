// components/blog/recent-posts.tsx
import { Suspense } from "react";
import { CardGridSkeleton } from "@/components/ui/card-grid-skeleton";

import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "../../../../convex/_generated/api";
import { PostCard } from "../post-card";

async function PostsContent() {
  const posts = await fetchAuthQuery(api.posts.getRecentPosts, {
    limit: 3,
  });

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

export function RecentPosts() {
  return (
    <Suspense fallback={<CardGridSkeleton count={3} />}>
      <PostsContent />
    </Suspense>
  );
}
