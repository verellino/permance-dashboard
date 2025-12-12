import { getAllInvites } from '@/lib/models/invite';
import { ObjectId } from 'mongodb';
import type { UserRole } from '@/lib/models/user';

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

export async function getInvitesData(options?: {
  limit?: number;
  skip?: number;
  workspaceId?: ObjectId;
  status?: 'pending' | 'accepted' | 'expired';
  role?: UserRole;
  search?: string;
}) {
  const invites = await getAllInvites(options);
  return serializeObjectId(invites);
}

