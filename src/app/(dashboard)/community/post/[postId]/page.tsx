"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, User, Edit, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LikeButton } from "@/components/community/LikeButton";
import { CommentSection } from "@/components/community/CommentSection";
import { planetaryPairs } from "@/data/planetaryPairs";

interface PostDetailPageProps {
  params: Promise<{ postId: string }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { postId } = use(params);
  const router = useRouter();
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);

  const post = useQuery(api.posts.getPost, { postId: postId as Id<"posts"> });
  const chartUrl = post?.chartImageId
    ? useQuery(api.storage.getChartUrl, { storageId: post.chartImageId as Id<"_storage"> })
    : null;
  const deletePost = useMutation(api.posts.deletePost);

  if (post === undefined) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
        <p className="text-muted-foreground mb-4">
          This post may have been deleted or doesn't exist.
        </p>
        <Link href="/community">
          <Button variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Community
          </Button>
        </Link>
      </div>
    );
  }

  const pairInfo = post.planetaryPairTag
    ? planetaryPairs.find((p) => p.slug === post.planetaryPairTag)
    : null;

  const isAuthor = user?.id === post.author?.clerkId;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePost({ postId: post._id });
      router.push("/community");
    } catch (error) {
      console.error("Failed to delete post:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/community">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Community
          </Button>
        </Link>
        {isAuthor && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${post.authorId}`}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author?.imageUrl} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link
                href={`/profile/${post.authorId}`}
                className="font-medium hover:underline"
              >
                {post.author?.firstName || post.author?.email?.split("@")[0] || "Anonymous"}
              </Link>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          {pairInfo && (
            <Badge variant="secondary">
              {pairInfo.planet1.symbol} {pairInfo.planet1.name}/{pairInfo.planet2.name}
            </Badge>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-lg whitespace-pre-wrap">{post.content}</p>
        </div>

        {chartUrl && (
          <div className="mt-6">
            <img
              src={chartUrl}
              alt="Birth Chart"
              className="w-full max-w-2xl mx-auto rounded-lg border"
            />
          </div>
        )}

        <div className="flex items-center gap-4 pt-4 border-t">
          <LikeButton
            targetId={post._id}
            targetType="post"
            initialLiked={post.isLikedByCurrentUser || false}
            initialLikeCount={post.likeCount}
          />
          <span className="text-sm text-muted-foreground">
            {post.commentCount} {post.commentCount === 1 ? "comment" : "comments"}
          </span>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <CommentSection postId={post._id} />
      </div>
    </div>
  );
}
