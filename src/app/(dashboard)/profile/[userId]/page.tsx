"use client";

import { use } from "react";
import { useQuery, usePaginatedQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { UserProfileCard } from "@/components/community/UserProfileCard";
import { PostCard } from "@/components/community/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = use(params);

  const profile = useQuery(api.users.getUserProfile, {
    userId: userId as Id<"users">,
  });

  const { results: posts } = usePaginatedQuery(
    api.posts.getUserPosts,
    { userId: userId as Id<"users"> },
    { initialNumItems: 20 }
  );

  if (profile === undefined) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (profile === null) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
        <p className="text-muted-foreground">This user profile doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <UserProfileCard profile={profile} />

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4 mt-6">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No posts yet</p>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4 mt-6">
          <div className="text-center py-12 text-muted-foreground">
            <p>Activity feed coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
