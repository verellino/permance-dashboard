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

