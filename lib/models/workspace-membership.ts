import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import type { WorkspaceType } from './workspace';
import type { UserRole, UserDocument } from './user';

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

export async function getMembershipsForWorkspace(workspaceId: ObjectId) {
  const db = await getDb();
  return db
    .collection<WorkspaceMembershipDocument>(COLLECTION)
    .find({ workspaceId })
    .toArray();
}

export async function getMembership(userId: ObjectId, workspaceId: ObjectId) {
  const db = await getDb();
  return db
    .collection<WorkspaceMembershipDocument>(COLLECTION)
    .findOne({ userId, workspaceId });
}

export async function updateMembershipRole(
  userId: ObjectId,
  workspaceId: ObjectId,
  role: UserRole
) {
  const db = await getDb();
  await db
    .collection<WorkspaceMembershipDocument>(COLLECTION)
    .updateOne(
      { userId, workspaceId },
      { $set: { role, updatedAt: new Date() } }
    );
}

export async function removeMembership(userId: ObjectId, workspaceId: ObjectId) {
  const db = await getDb();
  await db
    .collection<WorkspaceMembershipDocument>(COLLECTION)
    .deleteOne({ userId, workspaceId });
}

export async function getAllUsersWithMemberships(options?: {
  limit?: number;
  skip?: number;
  workspaceType?: WorkspaceType;
  role?: UserRole;
  search?: string;
}) {
  const db = await getDb();
  const usersCollection = db.collection<UserDocument>('users');
  const membershipsCollection = db.collection<WorkspaceMembershipDocument>(COLLECTION);
  
  // Build aggregation pipeline
  const pipeline: any[] = [
    {
      $lookup: {
        from: 'workspace_memberships',
        localField: '_id',
        foreignField: 'userId',
        as: 'memberships'
      }
    }
  ];
  
  // Filter by workspace type or role if provided
  if (options?.workspaceType || options?.role) {
    pipeline.push({
      $match: {
        memberships: {
          $elemMatch: {
            ...(options.workspaceType ? { workspaceType: options.workspaceType } : {}),
            ...(options.role ? { role: options.role } : {})
          }
        }
      }
    });
  }
  
  // Search filter
  if (options?.search) {
    pipeline.push({
      $match: {
        $or: [
          { email: { $regex: options.search, $options: 'i' } },
          { name: { $regex: options.search, $options: 'i' } }
        ]
      }
    });
  }
  
  // Pagination
  if (options?.skip) {
    pipeline.push({ $skip: options.skip });
  }
  if (options?.limit) {
    pipeline.push({ $limit: options.limit });
  }
  
  return usersCollection.aggregate(pipeline).toArray();
}

