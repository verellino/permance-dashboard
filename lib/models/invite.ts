import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import type { UserRole } from './user';

export type InviteDocument = {
  _id: ObjectId;
  tokenHash: string;
  email: string;
  workspaceId: ObjectId;
  role: UserRole;
  invitedBy: ObjectId;
  expiresAt: Date;
  acceptedAt?: Date | null;
  usedAt?: Date | null;
  createdAt: Date;
};

const COLLECTION = 'invites';

export async function findInviteByHash(tokenHash: string) {
  const db = await getDb();
  return db.collection<InviteDocument>(COLLECTION).findOne({ tokenHash });
}

export async function insertInvite(doc: InviteDocument) {
  const db = await getDb();
  await db.collection<InviteDocument>(COLLECTION).insertOne(doc);
}

export async function markInviteUsed(inviteId: ObjectId) {
  const db = await getDb();
  await db
    .collection<InviteDocument>(COLLECTION)
    .updateOne(
      { _id: inviteId },
      { $set: { usedAt: new Date(), acceptedAt: new Date() } }
    );
}

export async function getInviteById(inviteId: ObjectId) {
  const db = await getDb();
  return db.collection<InviteDocument>(COLLECTION).findOne({ _id: inviteId });
}

export async function getAllInvites(options?: {
  limit?: number;
  skip?: number;
  workspaceId?: ObjectId;
  status?: 'pending' | 'accepted' | 'expired';
  role?: UserRole;
  search?: string;
}) {
  const db = await getDb();
  const query: any = {};
  
  if (options?.workspaceId) {
    query.workspaceId = options.workspaceId;
  }
  
  if (options?.role) {
    query.role = options.role;
  }
  
  if (options?.search) {
    query.email = { $regex: options.search, $options: 'i' };
  }
  
  // Status filter
  if (options?.status) {
    const now = new Date();
    if (options.status === 'pending') {
      query.usedAt = { $exists: false };
      query.expiresAt = { $gt: now };
    } else if (options.status === 'accepted') {
      query.acceptedAt = { $exists: true };
    } else if (options.status === 'expired') {
      query.expiresAt = { $lt: now };
      query.usedAt = { $exists: false };
    }
  }
  
  const cursor = db.collection<InviteDocument>(COLLECTION).find(query);
  
  if (options?.skip) {
    cursor.skip(options.skip);
  }
  if (options?.limit) {
    cursor.limit(options.limit);
  }
  
  return cursor.sort({ createdAt: -1 }).toArray();
}

export async function revokeInvite(inviteId: ObjectId) {
  const db = await getDb();
  // Mark as used to prevent acceptance
  await db
    .collection<InviteDocument>(COLLECTION)
    .updateOne(
      { _id: inviteId },
      { $set: { usedAt: new Date(), updatedAt: new Date() } }
    );
}

export async function getPendingInvitesForWorkspace(workspaceId: ObjectId) {
  const db = await getDb();
  const now = new Date();
  return db
    .collection<InviteDocument>(COLLECTION)
    .find({
      workspaceId,
      usedAt: { $exists: false },
      expiresAt: { $gt: now }
    })
    .sort({ createdAt: -1 })
    .toArray();
}

