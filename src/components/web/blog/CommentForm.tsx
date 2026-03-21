"use client";

import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CommentFormProps {
  postId: Id<"posts">;
}

export function CommentForm({ postId }: CommentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const addComment = useMutation(api.comments.addComment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !comment) {
      toast.error("Please fill in all fields");
      return;
    }

    startTransition(async () => {
      try {
        await addComment({
          postId,
          name,
          email,
          comment,
        });
        setName("");
        setEmail("");
        setComment("");
        toast.success("Comment added successfully!");
      } catch (error) {
        toast.error("Failed to add comment. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/20 shadow-none">
        <CardContent className="p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            This form is safe. Your name and email will only be used for
            commenting and will not be shared anywhere.
          </p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="comment" className="text-sm font-medium">
            Comment
          </label>
          <Textarea
            id="comment"
            placeholder="Share your thoughts..."
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isPending}
            required
          />
        </div>
        <Button type="submit" disabled={isPending} className="w-full md:w-auto">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post Comment"
          )}
        </Button>
      </form>
    </div>
  );
}
