import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

export type WorkspaceType = 'MASTER' | 'CLIENT' | 'CLIPPER';

export type WorkspaceDocument = {
  _id: ObjectId;
  name: string;
  subdomain: string;
  type: WorkspaceType;
  settings?: Record<string, unknown>;
  parentWorkspaceId?: ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

const COLLECTION = 'workspaces';

export async function getWorkspaceBySubdomain(subdomain: string) {
  const db = await getDb();
  return db
    .collection<WorkspaceDocument>(COLLECTION)
    .findOne({ subdomain, deletedAt: { $exists: false } });
}

export async function createWorkspace(data: {
  name: string;
  subdomain: string;
  type: WorkspaceType;
  settings?: Record<string, unknown>;
  parentWorkspaceId?: ObjectId | null;
}) {
  const db = await getDb();
  const now = new Date();
  const doc: WorkspaceDocument = {
    _id: new ObjectId(),
    name: data.name,
    subdomain: data.subdomain,
    type: data.type,
    settings: data.settings ?? {},
    parentWorkspaceId: data.parentWorkspaceId ?? null,
    createdAt: now,
    updatedAt: now
  };
  await db.collection<WorkspaceDocument>(COLLECTION).insertOne(doc);
  return doc;
}

export async function softDeleteWorkspace(workspaceId: ObjectId) {
  const db = await getDb();
  await db
    .collection<WorkspaceDocument>(COLLECTION)
    .updateOne(
      { _id: workspaceId },
      { $set: { deletedAt: new Date(), updatedAt: new Date() } }
    );
}

export async function getWorkspaceById(workspaceId: ObjectId) {
  const db = await getDb();
  return db.collection<WorkspaceDocument>(COLLECTION).findOne({ _id: workspaceId });
}

export async function getWorkspacesByType(
  type: WorkspaceType,
  options?: {
    limit?: number;
    skip?: number;
    includeDeleted?: boolean;
    search?: string;
  }
) {
  const db = await getDb();
  const query: any = { type };
  
  if (!options?.includeDeleted) {
    query.deletedAt = { $exists: false };
  }
  
  if (options?.search) {
    query.$or = [
      { name: { $regex: options.search, $options: 'i' } },
      { subdomain: { $regex: options.search, $options: 'i' } }
    ];
  }
  
  const cursor = db.collection<WorkspaceDocument>(COLLECTION).find(query);
  
  if (options?.skip) {
    cursor.skip(options.skip);
  }
  if (options?.limit) {
    cursor.limit(options.limit);
  }
  
  return cursor.sort({ createdAt: -1 }).toArray();
}

export async function updateWorkspace(
  workspaceId: ObjectId,
  updates: Partial<Pick<WorkspaceDocument, 'name' | 'subdomain' | 'settings'>>
) {
  const db = await getDb();
  await db
    .collection<WorkspaceDocument>(COLLECTION)
    .updateOne(
      { _id: workspaceId },
      { $set: { ...updates, updatedAt: new Date() } }
    );
}

export async function checkSubdomainExists(subdomain: string, excludeId?: ObjectId) {
  const db = await getDb();
  const query: any = { subdomain, deletedAt: { $exists: false } };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  const existing = await db.collection<WorkspaceDocument>(COLLECTION).findOne(query);
  return !!existing;
}

