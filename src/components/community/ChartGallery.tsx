"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export function ChartGallery() {
  const charts = useQuery(api.storage.getAllCharts);

  if (charts === undefined) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (charts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No birth charts uploaded yet. Be the first to share yours!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {charts.map((chart) => (
        <Card key={chart._id} className="overflow-hidden hover:border-primary/20 transition-colors">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-secondary">
              {chart.chartUrl && (
                <img
                  src={chart.chartUrl}
                  alt={`${chart.user?.firstName || "User"}'s birth chart`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Link href={`/profile/${chart.userId}`}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={chart.user?.imageUrl} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/profile/${chart.userId}`}
                    className="font-medium hover:underline block truncate"
                  >
                    {chart.user?.firstName || chart.user?.email?.split("@")[0] || "Anonymous"}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(chart.uploadedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {chart.originalFileName}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
