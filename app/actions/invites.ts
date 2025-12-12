'use server';

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { sendInviteEmail } from '@/lib/email';
import { protocol, rootDomain } from '@/lib/utils';
import {
  insertInvite,
  findInviteByHash,
  markInviteUsed
} from '@/lib/models/invite';
import { insertUser, findUserByEmail } from '@/lib/models/user';
import { upsertMembership } from '@/lib/models/workspace-membership';
import { getWorkspaceById } from '@/lib/models/workspace';
import { logAuditEvent } from '@/lib/models/audit-log';

const INVITE_EXPIRY_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function generateToken(bytes = 24) {
  return crypto.randomBytes(bytes).toString('base64url');
}

export async function createInviteAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;
  const workspaceId = formData.get('workspaceId') as string;
  const invitedBy = formData.get('invitedBy') as string;

  if (!email || !role || !workspaceId || !invitedBy) {
    return { success: false, error: 'Missing fields' };
  }

  const token = generateToken(24);
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_MS);

  await insertInvite({
    _id: new ObjectId(),
    email,
    invitedBy: new ObjectId(invitedBy),
    role: role as any,
    tokenHash,
    workspaceId: new ObjectId(workspaceId),
    expiresAt,
    createdAt: new Date()
  });

  const inviteUrl = `${protocol}://${rootDomain}/accept-invite/${token}`;
  await sendInviteEmail(email, inviteUrl);

  await logAuditEvent({
    userId: new ObjectId(invitedBy),
    workspaceId: new ObjectId(workspaceId),
    action: 'INVITE_CREATE',
    resourceType: 'invite',
    resourceId: email,
    metadata: { role },
    createdAt: new Date()
  });

  return { success: true };
}

export async function acceptInviteAction(prevState: any, formData: FormData) {
  const token = formData.get('token') as string;
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;

  if (!token) {
    return { success: false, error: 'Missing invite token' };
  }

  const tokenHash = hashToken(token);
  const invite = await findInviteByHash(tokenHash);
  if (!invite) {
    return { success: false, error: 'Invite not found' };
  }
  if (invite.usedAt) {
    return { success: false, error: 'Invite already used' };
  }
  if (invite.expiresAt.getTime() < Date.now()) {
    return { success: false, error: 'Invite expired' };
  }

  const existingUser = await findUserByEmail(invite.email);
  const userId =
    existingUser?._id ||
    (
      await insertUser({
        email: invite.email,
        name,
        password: password ? await bcrypt.hash(password, 10) : null
      })
    )._id;

  // Get workspace to determine type
  const workspace = await getWorkspaceById(invite.workspaceId);
  if (!workspace) {
    return { success: false, error: 'Workspace not found' };
  }

  await upsertMembership({
    userId,
    workspaceId: invite.workspaceId,
    role: invite.role,
    workspaceType: workspace.type,
    invitedBy: invite.invitedBy
  });

  await markInviteUsed(invite._id);

  await logAuditEvent({
    userId,
    workspaceId: invite.workspaceId,
    action: 'INVITE_ACCEPT',
    resourceType: 'invite',
    resourceId: invite._id.toString(),
    metadata: { email: invite.email, role: invite.role },
    createdAt: new Date()
  });

  return { success: true };
}

