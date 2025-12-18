"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChartUploadZone } from "./ChartUploadZone";
import { Loader2 } from "lucide-react";

interface ChartUploadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChartUploadForm({ open, onOpenChange }: ChartUploadFormProps) {
  const [chartImageId, setChartImageId] = useState<Id<"_storage"> | undefined>();
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUploadComplete = (storageId: Id<"_storage">, fileName: string, fileSize: number) => {
    setChartImageId(storageId);
    setUploadedFile({ name: fileName, size: fileSize });
  };

  const handleRemoveUpload = () => {
    setChartImageId(undefined);
    setUploadedFile(null);
  };

  const handleSubmit = async () => {
    if (!chartImageId) return;

    setIsSubmitting(true);
    try {
      // Chart is already saved via ChartUploadZone's saveChartMetadata
      // Just close the dialog
      setChartImageId(undefined);
      setUploadedFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit chart:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Your Birth Chart</DialogTitle>
          <DialogDescription>
            Share your birth chart with the community. Upload an image or PDF of your chart.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <ChartUploadZone
            onUploadComplete={handleUploadComplete}
            onRemove={handleRemoveUpload}
            uploadedFile={uploadedFile}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!chartImageId || isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload to Gallery
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
