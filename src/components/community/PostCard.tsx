"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikeButton } from "./LikeButton";
import { Post } from "@/types";
import { planetaryPairs } from "@/data/planetaryPairs";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const pairInfo = post.planetaryPairTag
    ? planetaryPairs.find((p) => p.slug === post.planetaryPairTag)
    : null;

  const truncatedContent =
    post.content.length > 200
      ? post.content.substring(0, 200) + "..."
      : post.content;

  return (
    <Card className="hover:border-primary/20 transition-colors">
      <CardHeader className="space-y-3">
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
            <Badge variant="secondary" className="text-xs">
              {pairInfo.planet1.symbol} {pairInfo.planet1.name}/{pairInfo.planet2.name}
            </Badge>
          )}
        </div>
        <Link href={`/community/post/${post._id}`}>
          <h3 className="text-xl font-semibold hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent>
        <Link href={`/community/post/${post._id}`}>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {truncatedContent}
          </p>
        </Link>

        {post.chartImageId && (
          <div className="mt-4">
            <Badge variant="outline" className="text-xs">
              📊 Birth Chart Attached
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center gap-4">
        <LikeButton
          targetId={post._id}
          targetType="post"
          initialLiked={post.isLikedByCurrentUser || false}
          initialLikeCount={post.likeCount}
        />
        <Link href={`/community/post/${post._id}`}>
          <div className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
            <MessageSquare className="h-4 w-4" />
            <span>{post.commentCount}</span>
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
}
