# Community Forum Feature Documentation

## Overview
This document describes the community forum feature built for the Planetary Pairs astrology application. The feature enables users to share posts, upload birth charts, comment with threading, and interact through likes.

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [Backend Functions](#backend-functions)
5. [Frontend Components](#frontend-components)
6. [Routes](#routes)
7. [Features](#features)
8. [How It Works](#how-it-works)

---

## Tech Stack

### Backend
- **Convex**: Real-time database and backend platform
  - Handles data storage, queries, mutations, and file storage
  - Integrated with Clerk for authentication
  - Provides real-time subscriptions for live updates

### Frontend
- **Next.js 16.0.7**: React framework with App Router
- **React 19.2.0**: UI library
- **TypeScript**: Type safety
- **shadcn/ui**: Component library (Button, Card, Dialog, Tabs, Avatar, Textarea, etc.)
- **Tailwind CSS**: Styling
- **date-fns**: Date formatting

### Authentication
- **Clerk**: User authentication and management
- Auto-synced with Convex database

---

## Architecture

### Data Flow
```
User Action → Frontend Component → Convex Mutation/Query → Database → Real-time Update → All Connected Clients
```

### File Upload Flow
```
User Selects File → Validate (type, size) → Get Upload URL from Convex → Upload to Storage → Save Metadata → Display in Gallery
```

### Authentication Flow
```
User Signs In (Clerk) → useEffect Hook Detects User → Sync to Convex DB → User Document Created/Updated
```

---

## Database Schema

### Location: `convex/schema.ts`

### Tables

#### 1. **users**
```typescript
{
  clerkId: string (indexed),
  email: string,
  firstName?: string,
  lastName?: string,
  imageUrl?: string,
  createdAt: number,
  lastActiveAt: number
}
```
- Synced from Clerk authentication
- Indexed by `clerkId` for fast lookups
- Tracks user activity

#### 2. **posts**
```typescript
{
  authorId: Id<"users"> (indexed),
  title: string,
  content: string,
  planetaryPairTag?: string (indexed),
  chartImageId?: Id<"_storage">,
  createdAt: number (indexed),
  updatedAt: number,
  likeCount: number (indexed),
  commentCount: number (indexed)
}
```
- Main discussion posts
- Can be tagged with planetary pairs (sun-moon, mars-venus, etc.)
- Optional birth chart attachment
- Multiple indexes for efficient sorting/filtering

#### 3. **comments**
```typescript
{
  postId: Id<"posts"> (indexed),
  authorId: Id<"users"> (indexed),
  content: string,
  parentCommentId?: Id<"comments"> (indexed),
  createdAt: number (indexed),
  updatedAt: number,
  likeCount: number
}
```
- Supports threaded replies via `parentCommentId`
- Up to 3 levels of nesting
- Can be liked independently

#### 4. **likes**
```typescript
{
  userId: Id<"users"> (indexed),
  targetId: Id<"posts"> | Id<"comments"> (indexed),
  targetType: "post" | "comment",
  createdAt: number
}
```
- Compound index on `[userId, targetId]` ensures uniqueness
- One like per user per target

#### 5. **chartUploads**
```typescript
{
  userId: Id<"users"> (indexed),
  storageId: Id<"_storage">,
  originalFileName: string,
  fileType: string,
  fileSize: number,
  uploadedAt: number,
  associatedPostId?: Id<"posts">
}
```
- Stores metadata for uploaded birth charts
- Charts can be standalone or attached to posts
- Supports PNG, JPG, PDF (max 10MB)

---

## Backend Functions

### Location: `convex/` directory

### User Functions (`convex/users.ts`)

#### Mutations
- **`syncUser`**: Upserts user from Clerk data
  - Called automatically when user signs in
  - Updates `lastActiveAt` timestamp

#### Queries
- **`getCurrentUser`**: Gets authenticated user document
- **`getUserProfile`**: Gets user with stats (post count, comment count, total likes)
- **`getUserByClerkId`**: Finds user by Clerk ID

---

### Post Functions (`convex/posts.ts`)

#### Queries
- **`getPosts`**: Paginated feed query
  - Parameters: `sortBy` (newest/mostLiked), `planetaryPairFilter`
  - Returns posts with author info and user's like status
  - Uses multiple indexes for efficient filtering

- **`getPost`**: Single post by ID with full details

- **`getUserPosts`**: Gets all posts by specific user (for profile page)

#### Mutations
- **`createPost`**: Create new post
  - Validates authentication
  - Accepts: title, content, planetaryPairTag, chartImageId

- **`updatePost`**: Update existing post
  - Verifies user is author

- **`deletePost`**: Delete post
  - Cascades to delete all comments and likes

- **`togglePostLike`**: Add or remove like
  - Returns new like status and count
  - Atomic operation

---

### Comment Functions (`convex/comments.ts`)

#### Queries
- **`getPostComments`**: Get all comments for a post
  - Returns with author info and like status
  - Includes threading information

#### Mutations
- **`addComment`**: Create comment or reply
  - Parameters: `postId`, `content`, `parentCommentId` (optional)
  - Increments post's `commentCount`

- **`deleteComment`**: Delete comment
  - Cascades to delete child comments (if threaded)
  - Decrements post's `commentCount`

- **`toggleCommentLike`**: Like/unlike comment

---

### Storage Functions (`convex/storage.ts`)

#### Mutations
- **`generateUploadUrl`**: Get signed URL for file upload
  - Authenticated users only

- **`saveChartMetadata`**: Save file metadata after upload

- **`deleteChart`**: Delete chart and metadata
  - Verifies ownership

#### Queries
- **`getChartUrl`**: Get temporary signed URL for display

- **`getUserCharts`**: Get all charts uploaded by user

- **`getAllCharts`**: Get all charts for gallery
  - Returns 100 most recent charts
  - Enriched with user info and URLs

---

## Frontend Components

### Location: `src/components/community/`

### Core Components

#### 1. **LikeButton.tsx**
- Reusable heart button for posts and comments
- Optimistic updates for instant feedback
- Props: `targetId`, `targetType`, `initialLiked`, `initialLikeCount`

#### 2. **PostCard.tsx**
- Post preview card for feed
- Shows: title, content (truncated), author, timestamp, planetary pair badge, like/comment counts
- Links to full post detail page

#### 3. **PostFilters.tsx**
- Tabs for sorting (Newest/Most Liked)
- Dropdown for planetary pair filtering
- Clear filters button

#### 4. **CommunityFeed.tsx**
- Main feed container
- Infinite scroll pagination
- Loading skeletons
- Empty state

#### 5. **PostCreationForm.tsx**
- Dialog with form to create posts
- Inputs: title (max 200 chars), content (max 5000 chars), planetary pair tag, chart upload
- Validation and error handling

#### 6. **ChartUploadZone.tsx**
- Drag-and-drop file upload
- Validates file type (PNG/JPG/PDF) and size (max 10MB)
- Shows upload progress
- Preview of uploaded file

#### 7. **ChartGallery.tsx**
- Grid display of all uploaded birth charts
- Shows chart image, uploader info, timestamp
- Responsive grid: 1 column mobile, 2 tablet, 3 desktop

#### 8. **ChartUploadForm.tsx**
- Dialog for uploading standalone charts to gallery
- Simpler than post creation (just upload, no text)

#### 9. **CommentForm.tsx**
- Input for comments and replies
- Character limit: 2000
- Props: `postId`, `parentCommentId` (for threading), callbacks

#### 10. **CommentThread.tsx**
- Displays single comment with recursive threading
- Shows author, timestamp, content, likes
- Reply button (up to 3 levels deep)
- Delete button for comment author

#### 11. **CommentSection.tsx**
- Container for all comments on a post
- Organizes comments by threading
- Top-level comment form

#### 12. **UserProfileCard.tsx**
- User info display card
- Shows: avatar, name, email, join date
- Stats: post count, comment count, total likes received

---

## Routes

### Location: `src/app/(dashboard)/`

### Community Routes

#### 1. **`/community`** (`community/page.tsx`)
Main community hub with two tabs:

**Tab 1: Discussion Posts**
- Feed of all community posts
- Filters and sorting controls
- "New Post" button opens creation dialog

**Tab 2: Birth Chart Gallery**
- Grid of all uploaded birth charts
- "Upload Chart" button opens upload dialog

#### 2. **`/community/post/[postId]`** (`community/post/[postId]/page.tsx`)
Individual post detail page:
- Full post content (no truncation)
- Full-size chart image (if attached)
- Edit/Delete buttons (for author)
- Complete comment section with threading
- Breadcrumb navigation back to community

#### 3. **`/profile/[userId]`** (`profile/[userId]/page.tsx`)
User profile page:
- UserProfileCard at top
- Tabs: "Posts" and "Activity"
- List of user's posts
- Activity feed

---

## Features

### 1. Discussion Posts
- Create posts with title, content, and planetary pair tags
- Attach birth chart images to posts
- View posts in feed with sorting/filtering
- Like posts
- Comment on posts with threaded replies (up to 3 levels)
- Delete own posts and comments

### 2. Birth Chart Gallery
- Upload birth charts as standalone items
- View all community members' charts in grid layout
- Charts show uploader info and timestamp
- Click on user avatar to visit their profile

### 3. User Interactions
- **Likes**: Heart posts and comments (optimistic updates)
- **Comments**: Add comments with threading support
- **Replies**: Reply to comments (nested up to 3 levels)
- **Profiles**: View user profiles with activity stats

### 4. Filtering & Sorting
- **Filter by Planetary Pair**: Show only posts about specific pairs
- **Sort by Newest**: Chronological order
- **Sort by Most Liked**: Popularity-based

### 5. Real-time Updates
- New posts appear automatically
- Like counts update live
- Comments appear instantly
- No page refresh needed

### 6. File Upload
- Drag-and-drop interface
- File validation (type and size)
- Progress indicators
- Preview before submission
- Secure upload to Convex storage

---

## How It Works

### User Authentication Flow
1. User signs in via Clerk
2. Dashboard layout detects authenticated user (`useUser` hook)
3. `syncUser` mutation called automatically
4. User document created/updated in Convex
5. User can now interact with community features

### Creating a Post Flow
1. User clicks "New Post" button
2. PostCreationForm dialog opens
3. User fills in title, content, optional planetary pair tag
4. User optionally uploads birth chart (via ChartUploadZone)
5. Form validates input (character limits, required fields)
6. On submit, `createPost` mutation called
7. Post saved to database
8. Dialog closes, feed refreshes automatically
9. Post appears in feed for all users

### Commenting Flow
1. User views post detail page
2. CommentSection loads all comments via `getPostComments` query
3. User types comment in CommentForm
4. On submit, `addComment` mutation called
5. Comment saved, post's `commentCount` incremented
6. Comment appears in thread instantly
7. Other users see new comment via real-time subscription

### Liking Flow
1. User clicks heart button on post/comment
2. LikeButton performs optimistic update (instant UI feedback)
3. `togglePostLike` or `toggleCommentLike` mutation called
4. Database checks if like exists
5. If exists: delete like, decrement count
6. If not exists: create like, increment count
7. Result returned, UI updated with actual count

### Chart Upload Flow
1. User goes to "Birth Chart Gallery" tab
2. Clicks "Upload Chart" button
3. ChartUploadForm dialog opens
4. User drags/drops file or browses (PNG/JPG/PDF, max 10MB)
5. Client validates file
6. `generateUploadUrl` mutation called to get signed URL
7. File uploaded directly to Convex storage via fetch
8. Upload returns `storageId`
9. `saveChartMetadata` mutation called with storageId and file info
10. Dialog closes, gallery refreshes
11. Chart appears in gallery for all users

### Profile Viewing Flow
1. User clicks on someone's avatar/name
2. Navigate to `/profile/[userId]`
3. `getUserProfile` query loads user info and stats
4. `getUserPosts` query loads user's posts
5. Profile card displays with tabs
6. User can view posts and activity

---

## Navigation Integration

### Sidebar Updates
**Location**: `src/app/(dashboard)/layout.tsx`

Added new "Community" section in sidebar:
- Label: "Community"
- Link: "Forum" with MessageSquare icon
- Active state: highlights when on `/community` or `/community/*` routes

### User Sync Integration
Also in `layout.tsx`, added automatic user sync:
```typescript
const syncUser = useMutation(api.users.syncUser);

useEffect(() => {
  if (user && isLoaded) {
    syncUser({
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      imageUrl: user.imageUrl || undefined,
    });
  }
}, [user, isLoaded, syncUser]);
```

---

## Type Definitions

### Location: `src/types/index.ts`

Added community-related interfaces:

```typescript
interface User {
  _id: string;
  _creationTime: number;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  createdAt: number;
  lastActiveAt: number;
}

interface Post {
  _id: string;
  _creationTime: number;
  authorId: string;
  author?: User;
  title: string;
  content: string;
  planetaryPairTag?: string;
  chartImageId?: string;
  chartUrl?: string;
  createdAt: number;
  updatedAt: number;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser?: boolean;
}

interface Comment {
  _id: string;
  _creationTime: number;
  postId: string;
  authorId: string;
  author?: User;
  content: string;
  parentCommentId?: string;
  replies?: Comment[];
  createdAt: number;
  updatedAt: number;
  likeCount: number;
  isLikedByCurrentUser?: boolean;
}

interface Like {
  _id: string;
  _creationTime: number;
  userId: string;
  targetId: string;
  targetType: "post" | "comment";
  createdAt: number;
}

interface ChartUpload {
  _id: string;
  _creationTime: number;
  userId: string;
  storageId: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: number;
  associatedPostId?: string;
}

interface UserProfile extends User {
  postCount: number;
  commentCount: number;
  totalLikesReceived: number;
}
```

---

## Environment Variables

Required in `.env.local`:

```bash
# Existing
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
OPENROUTER_API_KEY=sk-or-v1-...

# New (generated by Convex)
CONVEX_DEPLOYMENT=...
NEXT_PUBLIC_CONVEX_URL=...
CLERK_JWT_ISSUER_DOMAIN=https://your-app.clerk.accounts.dev
```

---

## Key Design Decisions

### 1. Real-time Architecture
- Chose Convex for built-in real-time subscriptions
- All queries automatically update when data changes
- No need for manual polling or websockets

### 2. Optimistic Updates
- Likes update UI instantly before server confirmation
- Improves perceived performance
- Reverts on error

### 3. Threaded Comments
- Limited to 3 levels to prevent excessive nesting
- Uses `parentCommentId` for hierarchy
- Recursive component rendering

### 4. File Storage
- Direct upload to Convex storage
- Signed URLs for secure access
- Client-side validation before upload

### 5. Pagination
- Uses Convex `usePaginatedQuery` hook
- Infinite scroll pattern with "Load More" button
- Efficient data loading

### 6. Authentication Integration
- Seamless Clerk + Convex integration
- Automatic user sync on sign-in
- No manual API key management for users

---

## Testing Checklist

### Posts
- [ ] Create post without chart
- [ ] Create post with chart
- [ ] Edit own post
- [ ] Delete own post
- [ ] Cannot edit others' posts
- [ ] Filter by planetary pair
- [ ] Sort by newest
- [ ] Sort by most liked

### Comments
- [ ] Add top-level comment
- [ ] Reply to comment (level 2)
- [ ] Reply to reply (level 3)
- [ ] Delete own comment
- [ ] Cannot delete others' comments

### Likes
- [ ] Like post
- [ ] Unlike post
- [ ] Like comment
- [ ] Unlike comment
- [ ] Like persists after refresh

### Birth Charts
- [ ] Upload PNG chart
- [ ] Upload JPG chart
- [ ] Upload PDF chart
- [ ] File size validation works
- [ ] File type validation works
- [ ] Chart appears in gallery
- [ ] Chart displays in post

### Profiles
- [ ] View user profile
- [ ] See user's posts
- [ ] Stats are accurate
- [ ] Navigate from avatar click

### Real-time
- [ ] New posts appear without refresh
- [ ] Like counts update live
- [ ] Comments appear instantly
- [ ] Multiple users see updates

---

## Future Enhancements

### Potential Features
1. **Markdown Support**: Rich text formatting in posts
2. **@Mentions**: Notify users when mentioned
3. **Notifications**: Alert users of likes, comments, replies
4. **Search**: Full-text search across posts and comments
5. **Bookmarks**: Save favorite posts
6. **Moderation**: Report inappropriate content, admin tools
7. **Private Messages**: Direct messaging between users
8. **User Reputation**: Badges, levels based on contributions
9. **Post Categories**: Beyond planetary pairs
10. **Image Galleries**: Multiple images per post
11. **Edit History**: Track post/comment edits
12. **Vote System**: Upvote/downvote instead of just likes

### Performance Optimizations
1. Virtual scrolling for long lists
2. Image lazy loading
3. Comment pagination for posts with many comments
4. Cache optimization
5. CDN integration for static assets

---

## Troubleshooting

### Common Issues

#### Convex not connecting
- Check `NEXT_PUBLIC_CONVEX_URL` is set correctly
- Ensure `npx convex dev` is running
- Verify Clerk JWT issuer domain is configured

#### Users not syncing
- Check Clerk integration in `layout.tsx`
- Verify `CLERK_JWT_ISSUER_DOMAIN` environment variable
- Check browser console for sync errors

#### File uploads failing
- Verify file size < 10MB
- Check file type is PNG/JPG/PDF
- Ensure user is authenticated
- Check Convex storage configuration

#### Real-time updates not working
- Ensure using Convex hooks (useQuery, useMutation)
- Check ConvexProvider is wrapping app
- Verify Convex connection is active

---

## Maintenance Notes

### Regular Tasks
1. Monitor Convex usage and costs
2. Clean up old chart uploads (optional)
3. Review reported content (when moderation added)
4. Check for spam posts/comments
5. Update dependencies regularly

### Backup Strategy
- Convex provides automatic backups
- Export important data periodically
- Document any schema changes

---

## Contact & Support

For questions about this implementation:
- Review this documentation
- Check Convex docs: https://docs.convex.dev
- Check shadcn/ui docs: https://ui.shadcn.com
- Check Next.js docs: https://nextjs.org/docs

---

## Summary

The community forum feature is a complete social platform built on modern technologies:
- **Backend**: Convex provides real-time database, authentication, and file storage
- **Frontend**: Next.js + React with shadcn/ui components
- **Features**: Posts, comments, likes, birth chart gallery, user profiles
- **User Experience**: Real-time updates, optimistic UI, responsive design

All users with Clerk authentication can interact freely, creating a collaborative space for exploring astrology together.

---

*Last Updated: December 2024*
*Implementation Time: ~3 hours*
*Lines of Code: ~3,500+*
