"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

/* ---------- anonymous id ---------- */
const ANON_KEY = "portfolio_anon_id";

function getAnonId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(ANON_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ANON_KEY, id);
  }
  return id;
}

export function LikeButton({
  postId,
  initialLikes,
}: {
  postId: Id<"posts">;
  initialLikes: number;
}) {
  const toggleLike = useMutation(api.posts.toggleLike);

  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  /* restore liked state on mount */
  useEffect(() => {
    const saved = localStorage.getItem(`liked:${postId}`);
    setLiked(saved === "1");
  }, [postId]);

  async function handleLike() {
    if (loading || liked === null) return;

    const prevLiked = liked;
    const prevLikes = likes;

    // optimistic UI - update immediately
    const newLiked = !prevLiked;
    const newLikes = prevLiked ? prevLikes - 1 : prevLikes + 1;

    setLiked(newLiked);
    setLikes(newLikes);
    setLoading(true);

    try {
      const res = await toggleLike({
        postId,
        anonymousId: getAnonId(),
      });

      console.log("Like toggle response:", res);

      // Handle the response - ensure it's not null
      if (res) {
        setLiked(res.liked);
        setLikes(res.likes);
        localStorage.setItem(`liked:${postId}`, res.liked ? "1" : "0");
      } else {
        // If response is null, use optimistic values
        console.warn("Response was null, using optimistic values");
        localStorage.setItem(`liked:${postId}`, newLiked ? "1" : "0");
      }
    } catch (error) {
      // rollback on error
      console.error("Like toggle failed:", error);
      setLiked(prevLiked);
      setLikes(prevLikes);
    } finally {
      setLoading(false);
    }
  }

  if (liked === null) {
    return (
      <Button variant="outline" disabled className="gap-2 opacity-60">
        {likes} Likes
      </Button>
    );
  }

  return (
    <Button
      onClick={handleLike}
      disabled={loading}
      variant={liked ? "ghost" : "outline"}
      className="gap-2"
    >
      {liked && <Heart className="h-4 w-4 fill-red-500 text-red-500" />}
      {likes} {likes === 1 ? "Like" : "Likes"}
    </Button>
  );
}
