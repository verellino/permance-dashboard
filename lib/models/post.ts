import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { z } from 'zod';

// Type definitions
export type Platform = 'Instagram' | 'TikTok' | 'YouTube';
export type BaseFormat = 'Video/Reels' | 'Single Photo' | 'Carousel';
export type ContentType =
  | 'Video - Short (9:16)'
  | 'Video - Long (16:9)'
  | 'Photo - Single'
  | 'Carousel - Image/Text';
export type ReelStyle = 'Talking Head' | 'Lifestyle/B-roll' | 'Hybrid' | 'Other';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Main document type with clear field separation
export type PostDocument = {
  _id: ObjectId;

  // ========================================
  // BACKEND-MANAGED FIELDS (READ-ONLY FOR FRONTEND)
  // These fields are updated by backend jobs/services
  // ========================================
  url: string; // Required, unique identifier
  post_id?: string;
  username?: string;
  platform?: Platform;
  post_date?: Date;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  engagement_rate?: number;
  base_format?: BaseFormat;
  content_type?: ContentType;
  idea_concept?: string; // AI generated
  category?: string; // AI generated
  subcategory?: string[]; // AI generated, multi-label
  reel_style?: ReelStyle; // AI generated, only for videos
  processing_status: ProcessingStatus;
  last_updated?: Date; // Last stats update

  // ========================================
  // FRONTEND-MANAGED FIELDS (WRITABLE BY FRONTEND)
  // These fields are for business logic and workflow
  // ========================================
  is_trial: boolean; // Distinguishes trial vs published posts
  client?: ObjectId; // CLIENT workspace reference
  editor?: ObjectId; // CLIPPER workspace reference
  type?: string; // "Main Account" vs "Clip / Side Account"
  belongs_to?: string[]; // Board categorization: ["Finance", "Clipping", etc.]
  finance_item_id?: string; // Groups posts under same finance entry
  assignee?: ObjectId; // User assigned to this content
  added_by?: ObjectId; // User who added this trial reel
  added_date?: Date; // When trial reel was added

  // Standard fields
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Soft delete
};

const COLLECTION = 'posts';

// ========================================
// ZOD SCHEMAS FOR VALIDATION
// ========================================

// Schema for FRONTEND-WRITABLE fields only (for PATCH requests)
// CRITICAL: This excludes ALL backend-managed fields
export const PostFrontendSchema = z.object({
  is_trial: z.boolean().optional(),
  client: z.string().optional(),
  editor: z.string().optional(),
  type: z.string().optional(),
  belongs_to: z.array(z.string()).optional(),
  finance_item_id: z.string().optional(),
  assignee: z.string().optional(),
  added_by: z.string().optional(),
  added_date: z.string().datetime().optional(),
});

// Schema for creating new posts (POST requests)
export const PostCreateSchema = z.object({
  url: z.string().url('Invalid URL format'),
  is_trial: z.boolean().default(false),
  client: z.string().optional(),
  editor: z.string().optional(),
  type: z.string().optional(),
  belongs_to: z.array(z.string()).optional(),
  finance_item_id: z.string().optional(),
  assignee: z.string().optional(),
  added_by: z.string().optional(),
});

// ========================================
// QUERY FUNCTIONS
// ========================================

/**
 * Get a single post by ID
 */
export async function getPostById(id: ObjectId) {
  const db = await getDb();
  return db.collection<PostDocument>(COLLECTION).findOne({
    _id: id,
    deletedAt: { $exists: false },
  });
}

/**
 * Get a single post by URL
 */
export async function getPostByUrl(url: string) {
  const db = await getDb();
  return db.collection<PostDocument>(COLLECTION).findOne({
    url,
    deletedAt: { $exists: false },
  });
}

/**
 * Get posts with filtering, sorting, and pagination
 */
export async function getPosts(filter: {
  is_trial?: boolean;
  client?: ObjectId;
  editor?: ObjectId;
  platform?: Platform;
  category?: string;
  processing_status?: ProcessingStatus;
  belongs_to?: string;
  limit?: number;
  skip?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const db = await getDb();
  const query: any = { deletedAt: { $exists: false } };

  // Apply filters
  if (filter.is_trial !== undefined) query.is_trial = filter.is_trial;
  if (filter.client) query.client = filter.client;
  if (filter.editor) query.editor = filter.editor;
  if (filter.platform) query.platform = filter.platform;
  if (filter.category) query.category = filter.category;
  if (filter.processing_status) query.processing_status = filter.processing_status;
  if (filter.belongs_to) query.belongs_to = filter.belongs_to;

  // Setup sorting
  const sort: any = {};
  if (filter.sortBy) {
    sort[filter.sortBy] = filter.sortOrder === 'asc' ? 1 : -1;
  } else {
    sort.createdAt = -1; // Default: newest first
  }

  // Build cursor with pagination
  const cursor = db
    .collection<PostDocument>(COLLECTION)
    .find(query)
    .sort(sort);

  if (filter.skip) cursor.skip(filter.skip);
  if (filter.limit) cursor.limit(filter.limit);

  return cursor.toArray();
}

/**
 * Get count of posts matching filter
 */
export async function getPostsCount(filter: {
  is_trial?: boolean;
  client?: ObjectId;
  editor?: ObjectId;
  platform?: Platform;
  category?: string;
  processing_status?: ProcessingStatus;
}) {
  const db = await getDb();
  const query: any = { deletedAt: { $exists: false } };

  if (filter.is_trial !== undefined) query.is_trial = filter.is_trial;
  if (filter.client) query.client = filter.client;
  if (filter.editor) query.editor = filter.editor;
  if (filter.platform) query.platform = filter.platform;
  if (filter.category) query.category = filter.category;
  if (filter.processing_status) query.processing_status = filter.processing_status;

  return db.collection<PostDocument>(COLLECTION).countDocuments(query);
}

/**
 * Create a new post
 */
export async function createPost(data: {
  url: string;
  is_trial?: boolean;
  client?: ObjectId;
  editor?: ObjectId;
  type?: string;
  belongs_to?: string[];
  finance_item_id?: string;
  assignee?: ObjectId;
  added_by?: ObjectId;
}) {
  const db = await getDb();
  const now = new Date();

  const doc: PostDocument = {
    _id: new ObjectId(),
    url: data.url,
    is_trial: data.is_trial ?? false,
    processing_status: 'pending', // New posts start as pending
    client: data.client,
    editor: data.editor,
    type: data.type,
    belongs_to: data.belongs_to,
    finance_item_id: data.finance_item_id,
    assignee: data.assignee,
    added_by: data.added_by,
    added_date: data.is_trial ? now : undefined, // Only set for trial reels
    createdAt: now,
    updatedAt: now,
  };

  await db.collection<PostDocument>(COLLECTION).insertOne(doc);
  return doc;
}

/**
 * Update ONLY frontend-managed fields
 * CRITICAL: Backend fields cannot be updated via this function
 */
export async function updatePostFrontendFields(
  id: ObjectId,
  updates: Partial<{
    is_trial: boolean;
    client: ObjectId;
    editor: ObjectId;
    type: string;
    belongs_to: string[];
    finance_item_id: string;
    assignee: ObjectId;
  }>
) {
  const db = await getDb();
  await db.collection<PostDocument>(COLLECTION).updateOne(
    { _id: id, deletedAt: { $exists: false } },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    }
  );
}

/**
 * Soft delete a post (sets deletedAt timestamp)
 */
export async function softDeletePost(id: ObjectId) {
  const db = await getDb();
  const now = new Date();
  await db.collection<PostDocument>(COLLECTION).updateOne(
    { _id: id },
    { $set: { deletedAt: now, updatedAt: now } }
  );
}

/**
 * Hard delete a post (permanent removal)
 * Use with caution - prefer soft delete
 */
export async function hardDeletePost(id: ObjectId) {
  const db = await getDb();
  await db.collection<PostDocument>(COLLECTION).deleteOne({ _id: id });
}
