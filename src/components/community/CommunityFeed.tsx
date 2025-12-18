"use client";

import { useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { PostCard } from "./PostCard";
import { PostFilters } from "./PostFilters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function CommunityFeed() {
  const [sortBy, setSortBy] = useState<"newest" | "mostLiked">("newest");
  const [planetaryPairFilter, setPlanetaryPairFilter] = useState<string | undefined>();

  const { results, status, loadMore } = usePaginatedQuery(
    api.posts.getPosts,
    { sortBy, planetaryPairFilter },
    { initialNumItems: 10 }
  );

  return (
    <div className="space-y-6">
      <PostFilters
        sortBy={sortBy}
        onSortChange={setSortBy}
        planetaryPairFilter={planetaryPairFilter}
        onPairFilterChange={setPlanetaryPairFilter}
      />

      {status === "LoadingFirstPage" && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 p-6 border rounded-lg">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      )}

      {status !== "LoadingFirstPage" && results?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No posts yet. Be the first to share your astrological insights!
          </p>
        </div>
      )}

      <div className="space-y-4">
        {results?.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {status === "CanLoadMore" && (
        <div className="flex justify-center">
          <Button onClick={() => loadMore(10)} variant="outline">
            Load More
          </Button>
        </div>
      )}

      {status === "LoadingMore" && (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
