"use client";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

const STORAGE_KEY = "portfolio_liked_posts";

function getLikedPosts(): Set<string> {
  if (typeof window === "undefined") return new Set();
  const stored = localStorage.getItem(STORAGE_KEY);
  return new Set(stored ? JSON.parse(stored) : []);
}

function saveLikedPosts(likedSet: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...likedSet]));
}

function LikeButtonInner({
  postId,
  initialLikes,
}: {
  postId: Id<"posts">;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleLikeMutation = useMutation(api.posts.toggleLike);

  useEffect(() => {
    const likedPosts = getLikedPosts();
    setIsLiked(likedPosts.has(postId));
  }, [postId]);

  const handleToggleLike = async () => {
    const wasLiked = isLiked;
    const previousLikes = likes;

    // Optimistic update
    setIsLiked(!wasLiked);
    setLikes(wasLiked ? previousLikes - 1 : previousLikes + 1);

    setIsLoading(true);
    try {
      // Update localStorage
      const likedPosts = getLikedPosts();
      if (wasLiked) {
        likedPosts.delete(postId);
      } else {
        likedPosts.add(postId);
      }
      saveLikedPosts(likedPosts);

      // Call backend
      await toggleLikeMutation({ postId });
    } catch (error) {
      console.error("Failed to toggle like:", error);
      // Revert on error
      setIsLiked(wasLiked);
      setLikes(previousLikes);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggleLike}
      disabled={isLoading}
      variant={isLiked ? "ghost" : "outline"}
      className="gap-2 mt-8"
    >
      {isLiked && <Heart className="h-4 w-4 fill-red-500 text-red-500" />}
      {likes} {likes === 1 ? "Like" : "Likes"}
    </Button>
  );
}

export function LikeButton({
  postId,
  likes,
}: {
  postId: Id<"posts">;
  likes: number;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <LikeButtonInner postId={postId} initialLikes={likes} />
  ) : null;
}
