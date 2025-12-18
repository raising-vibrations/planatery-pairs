"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { CommentForm } from "./CommentForm";
import { CommentThread } from "./CommentThread";
import { Skeleton } from "@/components/ui/skeleton";
import { Comment } from "@/types";

interface CommentSectionProps {
  postId: Id<"posts">;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const comments = useQuery(api.comments.getPostComments, { postId });

  if (comments === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  // Organize comments by threading
  const topLevelComments = comments.filter((c) => !c.parentCommentId);
  const getReplies = (parentId: string): Comment[] => {
    return comments.filter((c) => c.parentCommentId === parentId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h3>
        <CommentForm postId={postId} />
      </div>

      {topLevelComments.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-6">
          {topLevelComments.map((comment) => {
            const replies = getReplies(comment._id);
            return (
              <CommentThread
                key={comment._id}
                comment={comment}
                replies={replies}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
