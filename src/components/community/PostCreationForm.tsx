"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
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
import { ChartUploadZone } from "./ChartUploadZone";
import { planetaryPairs } from "@/data/planetaryPairs";
import { Loader2 } from "lucide-react";

interface PostCreationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostCreationForm({ open, onOpenChange }: PostCreationFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [planetaryPairTag, setPlanetaryPairTag] = useState<string | undefined>();
  const [chartImageId, setChartImageId] = useState<Id<"_storage"> | undefined>();
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const createPost = useMutation(api.posts.createPost);

  const validateForm = () => {
    const newErrors: { title?: string; content?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > 200) {
      newErrors.title = "Title must be 200 characters or less";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    } else if (content.length > 5000) {
      newErrors.content = "Content must be 5000 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createPost({
        title: title.trim(),
        content: content.trim(),
        planetaryPairTag,
        chartImageId,
      });

      // Reset form
      setTitle("");
      setContent("");
      setPlanetaryPairTag(undefined);
      setChartImageId(undefined);
      setUploadedFile(null);
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create post:", error);
      setErrors({ content: "Failed to create post. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadComplete = (storageId: Id<"_storage">, fileName: string, fileSize: number) => {
    setChartImageId(storageId);
    setUploadedFile({ name: fileName, size: fileSize });
  };

  const handleRemoveUpload = () => {
    setChartImageId(undefined);
    setUploadedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
          <DialogDescription>
            Share your astrological insights and connect with the community
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              maxLength={200}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {title.length}/200 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, experiences, or questions..."
              rows={8}
              maxLength={5000}
              disabled={isSubmitting}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {content.length}/5000 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pair">Planetary Pair (Optional)</Label>
            <Select
              value={planetaryPairTag || "none"}
              onValueChange={(v) => setPlanetaryPairTag(v === "none" ? undefined : v)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a planetary pair" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {planetaryPairs.map((pair) => (
                  <SelectItem key={pair.id} value={pair.slug}>
                    {pair.planet1.symbol} {pair.planet1.name}/{pair.planet2.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Birth Chart (Optional)</Label>
            <ChartUploadZone
              onUploadComplete={(storageId) => {
                // We'll update this to properly handle the file metadata
                setChartImageId(storageId);
              }}
              onRemove={handleRemoveUpload}
              uploadedFile={uploadedFile}
            />
          </div>

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
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
