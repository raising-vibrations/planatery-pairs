import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate upload URL for file upload
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// Save chart metadata after upload
export const saveChartMetadata = mutation({
  args: {
    storageId: v.id("_storage"),
    originalFileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    associatedPostId: v.optional(v.id("posts")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const chartUploadId = await ctx.db.insert("chartUploads", {
      userId: user._id,
      storageId: args.storageId,
      originalFileName: args.originalFileName,
      fileType: args.fileType,
      fileSize: args.fileSize,
      uploadedAt: Date.now(),
      associatedPostId: args.associatedPostId,
    });

    return chartUploadId;
  },
});

// Get chart URL (for display)
export const getChartUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Delete chart
export const deleteChart = mutation({
  args: {
    chartUploadId: v.id("chartUploads"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const chartUpload = await ctx.db.get(args.chartUploadId);
    if (!chartUpload) {
      throw new Error("Chart not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || chartUpload.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    // Delete from storage
    await ctx.storage.delete(chartUpload.storageId);

    // Delete metadata
    await ctx.db.delete(args.chartUploadId);
  },
});

// Get user's uploaded charts
export const getUserCharts = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const charts = await ctx.db
      .query("chartUploads")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return charts;
  },
});

// Get all charts (for gallery)
export const getAllCharts = query({
  args: {},
  handler: async (ctx) => {
    const charts = await ctx.db
      .query("chartUploads")
      .order("desc")
      .take(100); // Limit to most recent 100 charts

    // Enrich with user info and URLs
    const enrichedCharts = await Promise.all(
      charts.map(async (chart) => {
        const user = await ctx.db.get(chart.userId);
        const chartUrl = await ctx.storage.getUrl(chart.storageId);
        return {
          ...chart,
          user,
          chartUrl,
        };
      })
    );

    return enrichedCharts;
  },
});
