export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  keywords: string[];
  archetype: string;
  essence: string;
  evolutionaryTeaching: string;
  shadowAspects: string[];
}

export interface Planet {
  id: string;
  name: string;
  symbol: string;
  archetype: string;
  description: string;
}

export interface PlanetaryPair {
  id: string;
  slug: string;
  planet1: Planet;
  planet2: Planet;
  theme: string;
  meaning: string;
  cycle?: string;
}

export interface Aspect {
  id: string;
  name: string;
  symbol?: string;
  degrees: number;
  orb: number;
  category: 'major' | 'minor';
}

export interface Phase {
  id: string;
  name: string;
  zodiacSign: string;
  element: 'Yang' | 'Yin';
  degreeRange: { start: number; end: number };
  keyword: string;
  description: string;
  evolutionaryFocus: string;
}

export interface PhaseAspectResult {
  phase: Phase | null;
  aspect: Aspect | null;
  isExact: boolean;
  degreeFromAspect: number | null;
  message?: string;
}

export interface ReportRequest {
  pairId: string;
  planet1Sign: string;
  planet2Sign: string;
  degreeSeparation?: number;
}

export interface GeneratedReport {
  content: string;
  pairId: string;
  planet1Sign: string;
  planet2Sign: string;
  generatedAt: Date;
}

// Community types
import { Id } from "../../convex/_generated/dataModel";

export interface User {
  _id: Id<"users">;
  _creationTime: number;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  createdAt: number;
  lastActiveAt: number;
}

export interface Post {
  _id: Id<"posts">;
  _creationTime: number;
  authorId: Id<"users">;
  author?: User | null;
  title: string;
  content: string;
  planetaryPairTag?: string;
  chartImageId?: Id<"_storage">;
  chartUrl?: string;
  createdAt: number;
  updatedAt: number;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser?: boolean;
}

export interface Comment {
  _id: Id<"comments">;
  _creationTime: number;
  postId: Id<"posts">;
  authorId: Id<"users">;
  author?: User | null;
  content: string;
  parentCommentId?: Id<"comments">;
  replies?: Comment[];
  createdAt: number;
  updatedAt: number;
  likeCount: number;
  isLikedByCurrentUser?: boolean;
}

export interface Like {
  _id: Id<"likes">;
  _creationTime: number;
  userId: Id<"users">;
  targetId: Id<"posts"> | Id<"comments">;
  targetType: "post" | "comment";
  createdAt: number;
}

export interface ChartUpload {
  _id: Id<"chartUploads">;
  _creationTime: number;
  userId: Id<"users">;
  storageId: Id<"_storage">;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: number;
  associatedPostId?: Id<"posts">;
}

export interface UserProfile extends User {
  postCount: number;
  commentCount: number;
  totalLikesReceived: number;
}
