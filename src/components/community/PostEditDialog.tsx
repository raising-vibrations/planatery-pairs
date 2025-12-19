"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { planetaryPairs } from "@/data/planetaryPairs";

interface PostEditDialogProps {
  postId: Id<"posts">;
  currentTitle: string;
  currentContent: string;
  currentPlanetaryPair?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PostEditDialog({
  postId,
  currentTitle,
  currentContent,
  currentPlanetaryPair,
  open,
  onOpenChange,
  onSuccess,
}: PostEditDialogProps) {
  const [title, setTitle] = useState(currentTitle);
  const [content, setContent] = useState(currentContent);
  const [planetaryPair, setPlanetaryPair] = useState(currentPlanetaryPair || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updatePost = useMutation(api.posts.updatePost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    if (title.length > 200) {
      setError("Title must be 200 characters or less");
      return;
    }

    if (content.length > 5000) {
      setError("Content must be 5000 characters or less");
      return;
    }

    setIsSubmitting(true);

    try {
      await updatePost({
        postId,
        title: title.trim(),
        content: content.trim(),
        planetaryPairTag: planetaryPair || undefined,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.error("Failed to update post:", err);
      setError("Failed to update post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Make changes to your post. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Give your post a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground text-right">
              {title.length}/200 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">
              Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts, experiences, or questions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={5000}
              rows={10}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground text-right">
              {content.length}/5000 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pair">Planetary Pair (Optional)</Label>
            <Select value={planetaryPair} onValueChange={setPlanetaryPair} disabled={isSubmitting}>
              <SelectTrigger id="pair">
                <SelectValue placeholder="Select a planetary pair..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {planetaryPairs.map((pair) => (
                  <SelectItem key={pair.id} value={pair.slug}>
                    {pair.planet1.symbol} {pair.planet1.name}/{pair.planet2.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
