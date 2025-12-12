import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

export type AuditAction =
  | 'LOGIN'
  | 'INVITE_CREATE'
  | 'INVITE_ACCEPT'
  | 'INVITE_REVOKE'
  | 'PASSWORD_RESET_REQUEST'
  | 'PASSWORD_RESET_COMPLETE'
  | 'EMAIL_VERIFY'
  | 'ROLE_CHANGE'
  | 'WORKSPACE_CREATE'
  | 'WORKSPACE_UPDATE'
  | 'WORKSPACE_DELETE';

export type AuditLogDocument = {
  _id: ObjectId;
  userId?: ObjectId | null;
  workspaceId?: ObjectId | null;
  action: AuditAction;
  resourceType?: string | null;
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
};

const COLLECTION = 'audit_logs';

export async function logAuditEvent(entry: Omit<AuditLogDocument, '_id'>) {
  const db = await getDb();
  await db.collection<AuditLogDocument>(COLLECTION).insertOne({
    _id: new ObjectId(),
    ...entry,
    createdAt: entry.createdAt ?? new Date()
  });
}

