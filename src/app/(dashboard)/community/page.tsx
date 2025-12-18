"use client";

import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { PostCreationForm } from "@/components/community/PostCreationForm";
import { ChartGallery } from "@/components/community/ChartGallery";
import { ChartUploadForm } from "@/components/community/ChartUploadForm";

export default function CommunityPage() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showUploadChart, setShowUploadChart] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-muted-foreground">
          Share your astrological insights and connect with others
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="posts">Discussion Posts</TabsTrigger>
            <TabsTrigger value="charts">Birth Chart Gallery</TabsTrigger>
          </TabsList>

          {activeTab === "posts" ? (
            <Button onClick={() => setShowCreatePost(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          ) : (
            <Button onClick={() => setShowUploadChart(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Chart
            </Button>
          )}
        </div>

        <TabsContent value="posts" className="mt-0">
          <CommunityFeed />
        </TabsContent>

        <TabsContent value="charts" className="mt-0">
          <ChartGallery />
        </TabsContent>
      </Tabs>

      <PostCreationForm open={showCreatePost} onOpenChange={setShowCreatePost} />
      <ChartUploadForm open={showUploadChart} onOpenChange={setShowUploadChart} />
    </div>
  );
}
