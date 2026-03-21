"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Calendar } from "lucide-react";

interface CommentListProps {
  postId: Id<"posts">;
}

export function CommentList({ postId }: CommentListProps) {
  const comments = useQuery(api.comments.getCommentsByPost, { postId });

  if (comments === undefined) {
    return (
      <div className="space-y-6 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-16 w-full bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-xl">
        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
        <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-bold">Comments</h3>
        <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-medium">
          {comments.length}
        </span>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="group">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                  {comment.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm">{comment.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {comment.comment}
                </p>
              </div>
            </div>
            <Separator className="mt-6 opacity-50 group-last:hidden" />
          </div>
        ))}
      </div>
    </div>
  );
}
