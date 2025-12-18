"use client";

import { formatDistanceToNow } from "date-fns";
import { User, Calendar, MessageSquare, FileText, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserProfile } from "@/types";

interface UserProfileCardProps {
  profile: UserProfile;
}

export function UserProfileCard({ profile }: UserProfileCardProps) {
  const displayName = profile.firstName && profile.lastName
    ? `${profile.firstName} ${profile.lastName}`
    : profile.firstName
    ? profile.firstName
    : profile.email?.split("@")[0] || "Anonymous User";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.imageUrl} />
            <AvatarFallback className="text-2xl">
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{displayName}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
              <Calendar className="h-4 w-4" />
              <span>
                Joined {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <FileText className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold">{profile.postCount}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold">{profile.commentCount}</p>
            <p className="text-xs text-muted-foreground">Comments</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Heart className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold">{profile.totalLikesReceived}</p>
            <p className="text-xs text-muted-foreground">Likes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
