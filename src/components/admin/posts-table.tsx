"use client";

import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { publishPostAction } from "@/app/actions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

type Post = {
  _id: Id<"posts">;
  title: string;
  status: "draft" | "published" | "archived";
  category?: string;
  createdAtFormatted: string;
  imageUrl?: string | null;
};

export default function PostsTable({ posts }: { posts: Post[] }) {
  const [localPosts, setLocalPosts] = useState(posts);
  const [selected, setSelected] = useState<Set<Id<"posts">>>(new Set());
  const [pendingId, setPendingId] = useState<Id<"posts"> | null>(null);
  const [isPending, startTransition] = useTransition();

  const publishPost = useMutation(api.posts.publishPost);
  const archivePost = useMutation(api.posts.archivePost);

  /* ------------------ helpers ------------------ */

  function toggleSelect(id: Id<"posts">) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function optimisticStatus(postId: Id<"posts">, status: Post["status"]) {
    setLocalPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, status } : p))
    );
  }

  /* ------------------ publish single ------------------ */

  async function handlePublish(postId: Id<"posts">) {
    setPendingId(postId);
    optimisticStatus(postId, "published");

    try {
      await publishPost({ postId });
      // Revalidate blog pages on demand
      await publishPostAction(postId);
      toast.success("Post published");
    } catch {
      setLocalPosts(posts);
      toast.error("Publish failed");
    } finally {
      setPendingId(null);
    }
  }

  /* ------------------ bulk publish ------------------ */

  async function handleBulkPublish() {
    const ids = Array.from(selected);

    startTransition(async () => {
      try {
        ids.forEach((id) => optimisticStatus(id, "published"));
        await Promise.all(ids.map((id) => publishPost({ postId: id })));
        // Revalidate blog pages after bulk publish
        await Promise.all(ids.map((id) => publishPostAction(id)));
        toast.success(`${ids.length} posts published`);
        setSelected(new Set());
      } catch {
        setLocalPosts(posts);
        toast.error("Bulk publish failed");
      }
    });
  }

  /* ------------------ archive ------------------ */

  async function handleArchive(postId: Id<"posts">) {
    const ok = confirm("Are you sure you want to archive this post?");
    if (!ok) return;

    optimisticStatus(postId, "archived");

    try {
      await archivePost({ postId });
      toast.success("Post archived");
    } catch {
      setLocalPosts(posts);
      toast.error("Archive failed");
    }
  }

  /* ------------------ UI ------------------ */

  return (
    <>
      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="mb-4 flex items-center gap-3">
          <Button size="sm" disabled={isPending} onClick={handleBulkPublish}>
            Publish selected ({selected.size})
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelected(new Set())}
          >
            Clear
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {localPosts.map((post) => (
            <TableRow key={post._id}>
              <TableCell>
                <Checkbox
                  checked={selected.has(post._id)}
                  onCheckedChange={() => toggleSelect(post._id)}
                />
              </TableCell>

              <TableCell>
                {post.imageUrl ? (
                  <div className="relative h-20 w-30 overflow-hidden">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>

              <TableCell className="font-medium">{post.title}</TableCell>

              <TableCell>
                <Badge
                  variant={
                    post.status === "published"
                      ? "default"
                      : post.status === "draft"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {post.status}
                </Badge>
              </TableCell>

              <TableCell>{post.category ?? "—"}</TableCell>
              <TableCell>{post.createdAtFormatted}</TableCell>

              <TableCell className="text-right space-x-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/dashboard/posts/${post._id}`}>Edit</Link>
                </Button>

                {post.status === "draft" && (
                  <Button
                    size="sm"
                    disabled={pendingId === post._id}
                    onClick={() => handlePublish(post._id)}
                  >
                    {pendingId === post._id ? "Publishing…" : "Publish"}
                  </Button>
                )}

                {post.status !== "archived" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleArchive(post._id)}
                  >
                    Archive
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
