"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { planetaryPairs } from "@/data/planetaryPairs";

interface PostFiltersProps {
  sortBy: "newest" | "mostLiked";
  onSortChange: (sort: "newest" | "mostLiked") => void;
  planetaryPairFilter?: string;
  onPairFilterChange: (pair?: string) => void;
}

export function PostFilters({
  sortBy,
  onSortChange,
  planetaryPairFilter,
  onPairFilterChange,
}: PostFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <Tabs value={sortBy} onValueChange={(v) => onSortChange(v as "newest" | "mostLiked")}>
        <TabsList>
          <TabsTrigger value="newest">Newest</TabsTrigger>
          <TabsTrigger value="mostLiked">Most Liked</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        <Select value={planetaryPairFilter || "all"} onValueChange={(v) => onPairFilterChange(v === "all" ? undefined : v)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by pair" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pairs</SelectItem>
            {planetaryPairs.map((pair) => (
              <SelectItem key={pair.id} value={pair.slug}>
                {pair.planet1.symbol} {pair.planet1.name}/{pair.planet2.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {planetaryPairFilter && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPairFilterChange(undefined)}
            className="h-9 w-9"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
