"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { User, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LikeButton } from "./LikeButton";
import { CommentForm } from "./CommentForm";
import { Comment } from "@/types";
import { useUser } from "@clerk/nextjs";

interface CommentThreadProps {
  comment: Comment;
  replies: Comment[];
  level?: number;
}

export function CommentThread({ comment, replies, level = 0 }: CommentThreadProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useUser();

  const deleteComment = useMutation(api.comments.deleteComment);

  const isAuthor = user?.id === comment.author?.clerkId;
  const maxLevel = 3; // Maximum nesting level for replies

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteComment({ commentId: comment._id });
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`space-y-3 ${level > 0 ? "ml-8 border-l-2 border-border pl-4" : ""}`}>
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${comment.authorId}`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author?.imageUrl} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link
                href={`/profile/${comment.authorId}`}
                className="text-sm font-medium hover:underline"
              >
                {comment.author?.firstName || comment.author?.email?.split("@")[0] || "Anonymous"}
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          {isAuthor && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8"
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          )}
        </div>

        <p className="text-sm whitespace-pre-wrap ml-11">{comment.content}</p>

        <div className="flex items-center gap-2 ml-11">
          <LikeButton
            targetId={comment._id}
            targetType="comment"
            initialLiked={comment.isLikedByCurrentUser || false}
            initialLikeCount={comment.likeCount}
            className="h-7"
          />
          {level < maxLevel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="h-7 text-xs"
            >
              Reply
            </Button>
          )}
        </div>

        {showReplyForm && (
          <div className="ml-11">
            <CommentForm
              postId={comment.postId}
              parentCommentId={comment._id}
              onSuccess={() => setShowReplyForm(false)}
              onCancel={() => setShowReplyForm(false)}
              placeholder="Write a reply..."
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Render nested replies */}
      {replies.length > 0 && (
        <div className="space-y-3">
          {replies.map((reply) => {
            const childReplies = replies.filter((r) => r.parentCommentId === reply._id);
            return (
              <CommentThread
                key={reply._id}
                comment={reply}
                replies={childReplies}
                level={level + 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
