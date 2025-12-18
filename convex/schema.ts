import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    lastActiveAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  posts: defineTable({
    authorId: v.id("users"),
    title: v.string(),
    content: v.string(),
    planetaryPairTag: v.optional(v.string()),
    chartImageId: v.optional(v.id("_storage")),
    createdAt: v.number(),
    updatedAt: v.number(),
    likeCount: v.number(),
    commentCount: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_created_at", ["createdAt"])
    .index("by_like_count", ["likeCount"])
    .index("by_planetary_pair", ["planetaryPairTag"])
    .index("by_pair_and_created", ["planetaryPairTag", "createdAt"])
    .index("by_pair_and_likes", ["planetaryPairTag", "likeCount"]),

  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.id("users"),
    content: v.string(),
    parentCommentId: v.optional(v.id("comments")),
    createdAt: v.number(),
    updatedAt: v.number(),
    likeCount: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_author", ["authorId"])
    .index("by_parent", ["parentCommentId"])
    .index("by_post_and_created", ["postId", "createdAt"]),

  likes: defineTable({
    userId: v.id("users"),
    targetId: v.union(v.id("posts"), v.id("comments")),
    targetType: v.union(v.literal("post"), v.literal("comment")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_target", ["targetId"])
    .index("by_user_and_target", ["userId", "targetId"])
    .index("by_user_and_type", ["userId", "targetType"]),

  chartUploads: defineTable({
    userId: v.id("users"),
    storageId: v.id("_storage"),
    originalFileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    uploadedAt: v.number(),
    associatedPostId: v.optional(v.id("posts")),
  })
    .index("by_user", ["userId"])
    .index("by_post", ["associatedPostId"])
    .index("by_storage", ["storageId"]),
});
