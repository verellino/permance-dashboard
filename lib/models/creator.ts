import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { z } from 'zod';

// Type definitions
export type Platform = 'Instagram' | 'TikTok' | 'YouTube';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Main document type with clear field separation
export type CreatorDocument = {
  _id: ObjectId;

  // ========================================
  // BACKEND-MANAGED FIELDS (READ-ONLY FOR FRONTEND)
  // These fields are updated by backend scraping jobs
  // ========================================
  url: string; // Required, unique identifier
  username: string; // Required
  platform?: Platform;

  // Profile information
  full_name?: string;
  biography?: string;
  profile_pic_url?: string;
  is_verified?: boolean;
  is_private?: boolean;

  // Follower metrics
  followers?: number;
  following?: number;

  // Content counts
  total_media_count?: number;
  video_count?: number;
  photo_count?: number;
  carousel_count?: number;

  // Aggregated stats
  total_views?: number;
  total_likes?: number;
  total_comments?: number;
  total_shares?: number;
  avg_views?: number;
  avg_engagement_rate?: number;

  // Time-based views
  views_last_7d?: number;
  views_last_30d?: number;
  views_last_90d?: number;
  views_last_365d?: number;
  views_last_calendar_week?: number;
  views_last_calendar_month?: number;
  views_since_1st_of_month?: number;

  // Growth tracking
  followers_since_1st_of_month?: number;
  followers_since_monday?: number;
  followers_since_start_of_growth?: number;

  // Tracking control
  tracking_enabled?: boolean;
  disabled_reason?: string;
  last_tracked_at?: Date;
  last_stats_update?: Date;
  processing_status?: ProcessingStatus;

  // Payment metrics (backend calculated)
  this_month_posting_volume?: number;
  last_month_posting_volume?: number;
  this_month_views_generated?: number;
  last_month_views_generated?: number;
  kpi_status?: string;

  // ========================================
  // FRONTEND-MANAGED FIELDS (WRITABLE BY FRONTEND)
  // These fields are for business logic and finance
  // ========================================
  base_monthly_pay?: number;
  amount_due_eom?: number;
  expected_monthly_posting_volume?: number;
  client?: ObjectId; // CLIENT workspace reference
  editor?: ObjectId; // CLIPPER workspace reference
  type?: string; // "Main Account" vs "Clip / Side Account"
  belongs_to?: string[]; // Board categorization
  finance_item_id?: string;
  started_date?: Date;
  last_paid_date?: Date;
  paid_amount?: number;
  phone_number?: string;
  payment_method?: string;

  // Standard fields
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Soft delete
};

const COLLECTION = 'creators';

// ========================================
// ZOD SCHEMAS FOR VALIDATION
// ========================================

// Schema for FRONTEND-WRITABLE fields only (for PATCH requests)
// CRITICAL: This excludes ALL backend-managed fields
export const CreatorFrontendSchema = z.object({
  base_monthly_pay: z.number().optional(),
  amount_due_eom: z.number().optional(),
  expected_monthly_posting_volume: z.number().optional(),
  client: z.string().optional(),
  editor: z.string().optional(),
  type: z.string().optional(),
  belongs_to: z.array(z.string()).optional(),
  finance_item_id: z.string().optional(),
  started_date: z.string().datetime().optional(),
  last_paid_date: z.string().datetime().optional(),
  paid_amount: z.number().optional(),
  phone_number: z.string().optional(),
  payment_method: z.string().optional(),
});

// Schema for creating new creators (POST requests)
export const CreatorCreateSchema = z.object({
  url: z.string().url('Invalid URL format'),
  username: z.string().min(1, 'Username is required'),
  platform: z.enum(['Instagram', 'TikTok', 'YouTube']).optional(),
  base_monthly_pay: z.number().optional(),
  client: z.string().optional(),
  editor: z.string().optional(),
  type: z.string().optional(),
  belongs_to: z.array(z.string()).optional(),
  finance_item_id: z.string().optional(),
});

// ========================================
// QUERY FUNCTIONS
// ========================================

/**
 * Get a single creator by ID
 */
export async function getCreatorById(id: ObjectId) {
  const db = await getDb();
  return db.collection<CreatorDocument>(COLLECTION).findOne({
    _id: id,
    deletedAt: { $exists: false },
  });
}

/**
 * Get a single creator by URL
 */
export async function getCreatorByUrl(url: string) {
  const db = await getDb();
  return db.collection<CreatorDocument>(COLLECTION).findOne({
    url,
    deletedAt: { $exists: false },
  });
}

/**
 * Get creators with filtering, sorting, and pagination
 */
export async function getCreators(filter: {
  client?: ObjectId;
  editor?: ObjectId;
  platform?: Platform;
  tracking_enabled?: boolean;
  limit?: number;
  skip?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const db = await getDb();
  const query: any = { deletedAt: { $exists: false } };

  // Apply filters
  if (filter.client) query.client = filter.client;
  if (filter.editor) query.editor = filter.editor;
  if (filter.platform) query.platform = filter.platform;
  if (filter.tracking_enabled !== undefined) query.tracking_enabled = filter.tracking_enabled;

  // Setup sorting
  const sort: any = {};
  if (filter.sortBy) {
    sort[filter.sortBy] = filter.sortOrder === 'asc' ? 1 : -1;
  } else {
    sort.createdAt = -1; // Default: newest first
  }

  // Build cursor with pagination
  const cursor = db
    .collection<CreatorDocument>(COLLECTION)
    .find(query)
    .sort(sort);

  if (filter.skip) cursor.skip(filter.skip);
  if (filter.limit) cursor.limit(filter.limit);

  return cursor.toArray();
}

/**
 * Get count of creators matching filter
 */
export async function getCreatorsCount(filter: {
  client?: ObjectId;
  editor?: ObjectId;
  platform?: Platform;
  tracking_enabled?: boolean;
}) {
  const db = await getDb();
  const query: any = { deletedAt: { $exists: false } };

  if (filter.client) query.client = filter.client;
  if (filter.editor) query.editor = filter.editor;
  if (filter.platform) query.platform = filter.platform;
  if (filter.tracking_enabled !== undefined) query.tracking_enabled = filter.tracking_enabled;

  return db.collection<CreatorDocument>(COLLECTION).countDocuments(query);
}

/**
 * Create a new creator
 */
export async function createCreator(data: {
  url: string;
  username: string;
  platform?: Platform;
  client?: ObjectId;
  editor?: ObjectId;
  type?: string;
  belongs_to?: string[];
  finance_item_id?: string;
  base_monthly_pay?: number;
  expected_monthly_posting_volume?: number;
}) {
  const db = await getDb();
  const now = new Date();

  const doc: CreatorDocument = {
    _id: new ObjectId(),
    url: data.url,
    username: data.username,
    platform: data.platform,
    tracking_enabled: true, // Enable tracking by default
    processing_status: 'pending', // New creators start as pending
    client: data.client,
    editor: data.editor,
    type: data.type,
    belongs_to: data.belongs_to,
    finance_item_id: data.finance_item_id,
    base_monthly_pay: data.base_monthly_pay,
    expected_monthly_posting_volume: data.expected_monthly_posting_volume,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection<CreatorDocument>(COLLECTION).insertOne(doc);
  return doc;
}

/**
 * Update ONLY frontend-managed fields
 * CRITICAL: Backend fields cannot be updated via this function
 */
export async function updateCreatorFrontendFields(
  id: ObjectId,
  updates: Partial<{
    base_monthly_pay: number;
    amount_due_eom: number;
    expected_monthly_posting_volume: number;
    client: ObjectId;
    editor: ObjectId;
    type: string;
    belongs_to: string[];
    finance_item_id: string;
    started_date: Date;
    last_paid_date: Date;
    paid_amount: number;
    phone_number: string;
    payment_method: string;
  }>
) {
  const db = await getDb();
  await db.collection<CreatorDocument>(COLLECTION).updateOne(
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
 * Soft delete a creator (sets deletedAt timestamp)
 */
export async function softDeleteCreator(id: ObjectId) {
  const db = await getDb();
  const now = new Date();
  await db.collection<CreatorDocument>(COLLECTION).updateOne(
    { _id: id },
    { $set: { deletedAt: now, updatedAt: now } }
  );
}

/**
 * Hard delete a creator (permanent removal)
 * Use with caution - prefer soft delete
 */
export async function hardDeleteCreator(id: ObjectId) {
  const db = await getDb();
  await db.collection<CreatorDocument>(COLLECTION).deleteOne({ _id: id });
}
