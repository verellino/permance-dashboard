import { getAllUsersWithMemberships } from '@/lib/models/workspace-membership';
import type { WorkspaceType } from '@/lib/models/workspace';
import type { UserRole } from '@/lib/models/user';
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

export async function getUsersData(options?: {
  limit?: number;
  skip?: number;
  workspaceType?: WorkspaceType;
  role?: UserRole;
  search?: string;
}) {
  const users = await getAllUsersWithMemberships(options);
  return serializeObjectId(users);
}

