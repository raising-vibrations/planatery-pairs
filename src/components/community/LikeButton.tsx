"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface LikeButtonProps {
  targetId: Id<"posts"> | Id<"comments">;
  targetType: "post" | "comment";
  initialLiked: boolean;
  initialLikeCount: number;
  className?: string;
}

export function LikeButton({
  targetId,
  targetType,
  initialLiked,
  initialLikeCount,
  className,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  const togglePostLike = useMutation(api.posts.togglePostLike);
  const toggleCommentLike = useMutation(api.comments.toggleCommentLike);

  const handleLike = async () => {
    if (isLoading) return;

    // Optimistic update
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1);

    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);
    setIsLoading(true);

    try {
      if (targetType === "post") {
        const result = await togglePostLike({ postId: targetId as Id<"posts"> });
        setIsLiked(result.liked);
        setLikeCount(result.likeCount);
      } else {
        const result = await toggleCommentLike({ commentId: targetId as Id<"comments"> });
        setIsLiked(result.liked);
        setLikeCount(result.likeCount);
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikeCount(initialLikeCount);
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className={className}
    >
      <Heart
        className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
      />
      <span className="ml-1">{likeCount}</span>
    </Button>
  );
}
