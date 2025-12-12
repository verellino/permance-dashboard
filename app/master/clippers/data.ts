import { getWorkspacesByType } from '@/lib/models/workspace';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

function serializeObjectId(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (obj instanceof ObjectId) {
    return obj.toString();
  }
  
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeObjectId);
  }
  
  if (typeof obj === 'object') {
    const serialized: any = {};
    for (const key in obj) {
      serialized[key] = serializeObjectId(obj[key]);
    }
    return serialized;
  }
  
  return obj;
}

export async function getClippersData(options?: {
  limit?: number;
  skip?: number;
  includeDeleted?: boolean;
  search?: string;
}) {
  const workspaces = await getWorkspacesByType('CLIPPER', options);
  
  if (workspaces.length === 0) {
    return [];
  }
  
  // Optimize: Get all member counts in a single aggregation query
  const db = await getDb();
  const workspaceIds = workspaces.map(w => w._id);
  
  const memberCounts = await db
    .collection('workspace_memberships')
    .aggregate([
      {
        $match: {
          workspaceId: { $in: workspaceIds }
        }
      },
      {
        $group: {
          _id: '$workspaceId',
          count: { $sum: 1 }
        }
      }
    ])
    .toArray();
  
  // Create a map for quick lookup
  const countMap = new Map(
    memberCounts.map((item: any) => [item._id.toString(), item.count])
  );
  
  // Enrich workspaces with member counts
  const workspacesWithCounts = workspaces.map((workspace) => ({
    ...workspace,
    memberCount: countMap.get(workspace._id.toString()) || 0
  }));
  
  return serializeObjectId(workspacesWithCounts);
}

