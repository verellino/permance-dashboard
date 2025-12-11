import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import type { WorkspaceType } from './workspace';
import type { UserRole } from './user';

export type WorkspaceMembershipDocument = {
  _id: ObjectId;
  userId: ObjectId;
  workspaceId: ObjectId;
  role: UserRole;
  workspaceType: WorkspaceType;
  joinedAt: Date;
  updatedAt: Date;
  invitedBy?: ObjectId | null;
};

const COLLECTION = 'workspace_memberships';

export async function getMembershipsForUser(userId: ObjectId) {
  const db = await getDb();
  return db
    .collection<WorkspaceMembershipDocument>(COLLECTION)
    .find({ userId })
    .toArray();
}

export async function upsertMembership(data: {
  userId: ObjectId;
  workspaceId: ObjectId;
  role: UserRole;
  workspaceType: WorkspaceType;
  invitedBy?: ObjectId | null;
}) {
  const db = await getDb();
  const now = new Date();
  await db.collection<WorkspaceMembershipDocument>(COLLECTION).updateOne(
    { userId: data.userId, workspaceId: data.workspaceId },
    {
      $set: {
        role: data.role,
        workspaceType: data.workspaceType,
        invitedBy: data.invitedBy ?? null,
        updatedAt: now
      },
      $setOnInsert: { joinedAt: now }
    },
    { upsert: true }
  );
}

