import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

// Get posts with pagination, sorting, and filtering
export const getPosts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    sortBy: v.union(v.literal("newest"), v.literal("mostLiked")),
    planetaryPairFilter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const currentUser = identity
      ? await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
          .first()
      : null;

    // Choose the right index based on filter and sort
    let postsQuery;
    if (args.planetaryPairFilter) {
      if (args.sortBy === "mostLiked") {
        postsQuery = ctx.db
          .query("posts")
          .withIndex("by_pair_and_likes", (q) =>
            q.eq("planetaryPairTag", args.planetaryPairFilter)
          )
          .order("desc");
      } else {
        postsQuery = ctx.db
          .query("posts")
          .withIndex("by_pair_and_created", (q) =>
            q.eq("planetaryPairTag", args.planetaryPairFilter)
          )
          .order("desc");
      }
    } else {
      if (args.sortBy === "mostLiked") {
        postsQuery = ctx.db
          .query("posts")
          .withIndex("by_like_count")
          .order("desc");
      } else {
        postsQuery = ctx.db
          .query("posts")
          .withIndex("by_created_at")
          .order("desc");
      }
    }

    const posts = await postsQuery.paginate(args.paginationOpts);

    // Enrich posts with author info and like status
    const enrichedPosts = await Promise.all(
      posts.page.map(async (post) => {
        const author = await ctx.db.get(post.authorId);

        // Check if current user has liked this post
        let isLikedByCurrentUser = false;
        if (currentUser) {
          const like = await ctx.db
            .query("likes")
            .withIndex("by_user_and_target", (q) =>
              q.eq("userId", currentUser._id).eq("targetId", post._id)
            )
            .first();
          isLikedByCurrentUser = !!like;
        }

        return {
          ...post,
          author,
          isLikedByCurrentUser,
        };
      })
    );

    return {
      ...posts,
      page: enrichedPosts,
    };
  },
});

// Get single post by ID
export const getPost = query({
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

    const post = await ctx.db.get(args.postId);
    if (!post) {
      return null;
    }

    const author = await ctx.db.get(post.authorId);

    // Check if current user has liked this post
    let isLikedByCurrentUser = false;
    if (currentUser) {
      const like = await ctx.db
        .query("likes")
        .withIndex("by_user_and_target", (q) =>
          q.eq("userId", currentUser._id).eq("targetId", post._id)
        )
        .first();
      isLikedByCurrentUser = !!like;
    }

    return {
      ...post,
      author,
      isLikedByCurrentUser,
    };
  },
});

// Get posts by specific user
export const getUserPosts = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", args.userId))
      .order("desc")
      .paginate(args.paginationOpts);

    const enrichedPosts = await Promise.all(
      posts.page.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        return {
          ...post,
          author,
        };
      })
    );

    return {
      ...posts,
      page: enrichedPosts,
    };
  },
});

// Create new post
export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    planetaryPairTag: v.optional(v.string()),
    chartImageId: v.optional(v.id("_storage")),
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

    const now = Date.now();
    const postId = await ctx.db.insert("posts", {
      authorId: user._id,
      title: args.title,
      content: args.content,
      planetaryPairTag: args.planetaryPairTag,
      chartImageId: args.chartImageId,
      createdAt: now,
      updatedAt: now,
      likeCount: 0,
      commentCount: 0,
    });

    return postId;
  },
});

// Update post
export const updatePost = mutation({
  args: {
    postId: v.id("posts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    planetaryPairTag: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || post.authorId !== user._id) {
      throw new Error("Unauthorized");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) updateData.title = args.title;
    if (args.content !== undefined) updateData.content = args.content;
    if (args.planetaryPairTag !== undefined)
      updateData.planetaryPairTag = args.planetaryPairTag;

    await ctx.db.patch(args.postId, updateData);
  },
});

// Delete post
export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || post.authorId !== user._id) {
      throw new Error("Unauthorized");
    }

    // Delete all comments on this post
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    for (const comment of comments) {
      // Delete likes on this comment
      const commentLikes = await ctx.db
        .query("likes")
        .withIndex("by_target", (q) => q.eq("targetId", comment._id))
        .collect();
      for (const like of commentLikes) {
        await ctx.db.delete(like._id);
      }
      await ctx.db.delete(comment._id);
    }

    // Delete likes on this post
    const postLikes = await ctx.db
      .query("likes")
      .withIndex("by_target", (q) => q.eq("targetId", args.postId))
      .collect();
    for (const like of postLikes) {
      await ctx.db.delete(like._id);
    }

    // Delete the post
    await ctx.db.delete(args.postId);
  },
});

// Toggle post like
export const togglePostLike = mutation({
  args: {
    postId: v.id("posts"),
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

    // Check if like already exists
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_user_and_target", (q) =>
        q.eq("userId", user._id).eq("targetId", args.postId)
      )
      .first();

    if (existingLike) {
      // Unlike: remove like and decrement count
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.postId, {
        likeCount: Math.max(0, post.likeCount - 1),
      });
      return { liked: false, likeCount: Math.max(0, post.likeCount - 1) };
    } else {
      // Like: add like and increment count
      await ctx.db.insert("likes", {
        userId: user._id,
        targetId: args.postId,
        targetType: "post",
        createdAt: Date.now(),
      });
      await ctx.db.patch(args.postId, {
        likeCount: post.likeCount + 1,
      });
      return { liked: true, likeCount: post.likeCount + 1 };
    }
  },
});
