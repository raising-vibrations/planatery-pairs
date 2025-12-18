import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all comments for a post with threading
export const getPostComments = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const currentUser = identity
      ? await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
          .first()
      : null;

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    // Enrich comments with author info and like status
    const enrichedComments = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.authorId);

        // Check if current user has liked this comment
        let isLikedByCurrentUser = false;
        if (currentUser) {
          const like = await ctx.db
            .query("likes")
            .withIndex("by_user_and_target", (q) =>
              q.eq("userId", currentUser._id).eq("targetId", comment._id)
            )
            .first();
          isLikedByCurrentUser = !!like;
        }

        return {
          ...comment,
          author,
          isLikedByCurrentUser,
        };
      })
    );

    return enrichedComments;
  },
});

// Add a comment
export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
    parentCommentId: v.optional(v.id("comments")),
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

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // If this is a reply, verify parent comment exists
    if (args.parentCommentId) {
      const parentComment = await ctx.db.get(args.parentCommentId);
      if (!parentComment) {
        throw new Error("Parent comment not found");
      }
    }

    const now = Date.now();

    // Create comment
    const commentId = await ctx.db.insert("comments", {
      postId: args.postId,
      authorId: user._id,
      content: args.content,
      parentCommentId: args.parentCommentId,
      createdAt: now,
      updatedAt: now,
      likeCount: 0,
    });

    // Increment post comment count
    await ctx.db.patch(args.postId, {
      commentCount: post.commentCount + 1,
    });

    return commentId;
  },
});

// Delete a comment
export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || comment.authorId !== user._id) {
      throw new Error("Unauthorized");
    }

    // Find and delete all child comments (replies)
    const childComments = await ctx.db
      .query("comments")
      .withIndex("by_parent", (q) => q.eq("parentCommentId", args.commentId))
      .collect();

    for (const childComment of childComments) {
      // Delete likes on child comments
      const childLikes = await ctx.db
        .query("likes")
        .withIndex("by_target", (q) => q.eq("targetId", childComment._id))
        .collect();
      for (const like of childLikes) {
        await ctx.db.delete(like._id);
      }
      await ctx.db.delete(childComment._id);
    }

    // Delete likes on this comment
    const commentLikes = await ctx.db
      .query("likes")
      .withIndex("by_target", (q) => q.eq("targetId", args.commentId))
      .collect();
    for (const like of commentLikes) {
      await ctx.db.delete(like._id);
    }

    // Decrement post comment count (parent + children)
    const post = await ctx.db.get(comment.postId);
    if (post) {
      await ctx.db.patch(comment.postId, {
        commentCount: Math.max(0, post.commentCount - (1 + childComments.length)),
      });
    }

    // Delete the comment
    await ctx.db.delete(args.commentId);
  },
});

// Toggle comment like
export const toggleCommentLike = mutation({
  args: {
    commentId: v.id("comments"),
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

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check if like already exists
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_user_and_target", (q) =>
        q.eq("userId", user._id).eq("targetId", args.commentId)
      )
      .first();

    if (existingLike) {
      // Unlike: remove like and decrement count
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.commentId, {
        likeCount: Math.max(0, comment.likeCount - 1),
      });
      return { liked: false, likeCount: Math.max(0, comment.likeCount - 1) };
    } else {
      // Like: add like and increment count
      await ctx.db.insert("likes", {
        userId: user._id,
        targetId: args.commentId,
        targetType: "comment",
        createdAt: Date.now(),
      });
      await ctx.db.patch(args.commentId, {
        likeCount: comment.likeCount + 1,
      });
      return { liked: true, likeCount: comment.likeCount + 1 };
    }
  },
});
