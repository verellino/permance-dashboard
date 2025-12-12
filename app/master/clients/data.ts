import { getWorkspacesByType } from '@/lib/models/workspace';
import { getMembershipsForWorkspace } from '@/lib/models/workspace-membership';
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

export async function getClientsData(options?: {
  limit?: number;
  skip?: number;
  includeDeleted?: boolean;
  search?: string;
}) {
  const workspaces = await getWorkspacesByType('CLIENT', options);
  
  // Enrich with member counts
  const workspacesWithCounts = await Promise.all(
    workspaces.map(async (workspace) => {
      const members = await getMembershipsForWorkspace(workspace._id);
      return {
        ...workspace,
        memberCount: members.length
      };
    })
  );
  
  return serializeObjectId(workspacesWithCounts);
}

