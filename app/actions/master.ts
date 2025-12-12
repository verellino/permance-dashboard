'use server';

import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/rbac';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  updateUser,
  updateUserPassword,
  getUserById
} from '@/lib/models/user';
import {
  createWorkspace,
  updateWorkspace,
  softDeleteWorkspace,
  checkSubdomainExists,
  getWorkspaceById
} from '@/lib/models/workspace';
import {
  upsertMembership,
  updateMembershipRole,
  removeMembership
} from '@/lib/models/workspace-membership';
import {
  insertInvite,
  revokeInvite,
  getInviteById
} from '@/lib/models/invite';
import { logAuditEvent } from '@/lib/models/audit-log';
import { sendInviteEmail } from '@/lib/email';
import { protocol, rootDomain } from '@/lib/utils';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const INVITE_EXPIRY_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function generateToken(bytes = 24) {
  return crypto.randomBytes(bytes).toString('base64url');
}

async function requireMasterPermission(permission: string) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', permission as any)) {
    throw new Error('Unauthorized');
  }

  return { session, membership };
}

// User Actions
const UpdateUserSchema = z.object({
  userId: z.string().transform((val) => new ObjectId(val)),
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional()
});

export async function updateUserAction(data: z.infer<typeof UpdateUserSchema>) {
  try {
    await requireMasterPermission('MANAGE_USERS');
    const validated = UpdateUserSchema.parse(data);
    
    const updates: any = {};
    if (validated.name !== undefined) updates.name = validated.name;
    if (validated.email !== undefined) updates.email = validated.email;
    
    if (Object.keys(updates).length > 0) {
      await updateUser(validated.userId, updates);
    }
    
    if (validated.password) {
      const hashedPassword = await bcrypt.hash(validated.password, 10);
      await updateUserPassword(validated.userId, hashedPassword);
    }
    
    revalidatePath('/master/users');
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update user' };
  }
}

// Workspace Actions
const CreateWorkspaceSchema = z.object({
  name: z.string().min(1),
  subdomain: z.string().regex(/^[a-z0-9-]+$/, 'Subdomain must be lowercase alphanumeric with dashes'),
  type: z.enum(['CLIENT', 'CLIPPER']),
  parentWorkspaceId: z.string().transform((val) => new ObjectId(val)).optional().or(z.undefined().transform(() => undefined))
});

export async function createWorkspaceAction(data: z.infer<typeof CreateWorkspaceSchema>) {
  try {
    const permission = data.type === 'CLIENT' ? 'MANAGE_CLIENTS' : 'MANAGE_CLIPPERS';
    const { session } = await requireMasterPermission(permission);
    const validated = CreateWorkspaceSchema.parse(data);
    
    const exists = await checkSubdomainExists(validated.subdomain);
    if (exists) {
      return { success: false, error: 'Subdomain already exists' };
    }
    
    const workspace = await createWorkspace({
      name: validated.name,
      subdomain: validated.subdomain,
      type: validated.type,
      parentWorkspaceId: validated.parentWorkspaceId ?? null
    });
    
    await logAuditEvent({
      userId: new ObjectId((session as any).user.id),
      workspaceId: workspace._id,
      action: 'WORKSPACE_CREATE' as any,
      resourceType: 'workspace',
      resourceId: workspace._id.toString(),
      metadata: { type: validated.type },
      createdAt: new Date()
    });
    
    revalidatePath(`/master/${validated.type.toLowerCase()}s`);
    return { success: true, data: workspace };
  } catch (error) {
    console.error('Error creating workspace:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create workspace' };
  }
}

const UpdateWorkspaceSchema = z.object({
  workspaceId: z.string().transform((val) => new ObjectId(val)),
  name: z.string().min(1).optional(),
  subdomain: z.string().regex(/^[a-z0-9-]+$/, 'Subdomain must be lowercase alphanumeric with dashes').optional(),
  settings: z.record(z.unknown()).optional(),
  parentWorkspaceId: z.string().optional().transform((val) => val ? new ObjectId(val) : null)
});

export async function updateWorkspaceAction(data: z.infer<typeof UpdateWorkspaceSchema>) {
  try {
    const workspace = await getWorkspaceById(data.workspaceId);
    if (!workspace) {
      return { success: false, error: 'Workspace not found' };
    }
    
    const permission = workspace.type === 'CLIENT' ? 'MANAGE_CLIENTS' : 'MANAGE_CLIPPERS';
    await requireMasterPermission(permission);
    const validated = UpdateWorkspaceSchema.parse(data);
    
    if (validated.subdomain && validated.subdomain !== workspace.subdomain) {
      const exists = await checkSubdomainExists(validated.subdomain, workspace._id);
      if (exists) {
        return { success: false, error: 'Subdomain already exists' };
      }
    }
    
    const updates: any = {};
    if (validated.name) updates.name = validated.name;
    if (validated.subdomain) updates.subdomain = validated.subdomain;
    if (validated.settings) updates.settings = validated.settings;
    if (validated.parentWorkspaceId !== undefined) updates.parentWorkspaceId = validated.parentWorkspaceId;
    
    await updateWorkspace(workspace._id, updates);
    
    revalidatePath(`/master/${workspace.type.toLowerCase()}s`);
    return { success: true };
  } catch (error) {
    console.error('Error updating workspace:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update workspace' };
  }
}

export async function deleteWorkspaceAction(workspaceId: string) {
  try {
    const workspace = await getWorkspaceById(new ObjectId(workspaceId));
    if (!workspace) {
      return { success: false, error: 'Workspace not found' };
    }
    
    const permission = workspace.type === 'CLIENT' ? 'MANAGE_CLIENTS' : 'MANAGE_CLIPPERS';
    await requireMasterPermission(permission);
    
    await softDeleteWorkspace(workspace._id);
    
    revalidatePath(`/master/${workspace.type.toLowerCase()}s`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting workspace:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete workspace' };
  }
}

// Membership Actions
const AddMemberSchema = z.object({
  workspaceId: z.string().transform((val) => new ObjectId(val)),
  userId: z.string().transform((val) => new ObjectId(val)),
  role: z.enum(['OWNER', 'ADMIN', 'USER', 'VIEW_ONLY'])
});

export async function addMemberAction(data: z.infer<typeof AddMemberSchema>) {
  try {
    const workspace = await getWorkspaceById(data.workspaceId);
    if (!workspace) {
      return { success: false, error: 'Workspace not found' };
    }
    
    const permission = workspace.type === 'CLIENT' ? 'MANAGE_CLIENTS' : 'MANAGE_CLIPPERS';
    const { session } = await requireMasterPermission(permission);
    const validated = AddMemberSchema.parse(data);
    
    await upsertMembership({
      userId: validated.userId,
      workspaceId: validated.workspaceId,
      role: validated.role,
      workspaceType: workspace.type,
      invitedBy: new ObjectId((session as any).user.id)
    });
    
    revalidatePath(`/master/${workspace.type.toLowerCase()}s/${validated.workspaceId.toString()}`);
    return { success: true };
  } catch (error) {
    console.error('Error adding member:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add member' };
  }
}

const UpdateMemberRoleSchema = z.object({
  workspaceId: z.string().transform((val) => new ObjectId(val)),
  userId: z.string().transform((val) => new ObjectId(val)),
  role: z.enum(['OWNER', 'ADMIN', 'USER', 'VIEW_ONLY'])
});

export async function updateMemberRoleAction(data: z.infer<typeof UpdateMemberRoleSchema>) {
  try {
    const workspace = await getWorkspaceById(data.workspaceId);
    if (!workspace) {
      return { success: false, error: 'Workspace not found' };
    }
    
    const permission = workspace.type === 'CLIENT' ? 'MANAGE_CLIENTS' : 'MANAGE_CLIPPERS';
    await requireMasterPermission(permission);
    const validated = UpdateMemberRoleSchema.parse(data);
    
    await updateMembershipRole(validated.userId, validated.workspaceId, validated.role);
    
    await logAuditEvent({
      userId: validated.userId,
      workspaceId: validated.workspaceId,
      action: 'ROLE_CHANGE',
      resourceType: 'membership',
      resourceId: validated.userId.toString(),
      metadata: { role: validated.role },
      createdAt: new Date()
    });
    
    revalidatePath(`/master/${workspace.type.toLowerCase()}s/${validated.workspaceId.toString()}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating member role:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update member role' };
  }
}

export async function removeMemberAction(workspaceId: string, userId: string) {
  try {
    const workspace = await getWorkspaceById(new ObjectId(workspaceId));
    if (!workspace) {
      return { success: false, error: 'Workspace not found' };
    }
    
    const permission = workspace.type === 'CLIENT' ? 'MANAGE_CLIENTS' : 'MANAGE_CLIPPERS';
    await requireMasterPermission(permission);
    
    await removeMembership(new ObjectId(userId), new ObjectId(workspaceId));
    
    revalidatePath(`/master/${workspace.type.toLowerCase()}s/${workspaceId}`);
    return { success: true };
  } catch (error) {
    console.error('Error removing member:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to remove member' };
  }
}

// Invite Actions
const CreateInviteSchema = z.object({
  email: z.string().email(),
  workspaceId: z.string().transform((val) => new ObjectId(val)),
  role: z.enum(['OWNER', 'ADMIN', 'USER', 'VIEW_ONLY']),
  expiresInDays: z.number().min(1).max(30).optional().default(7)
});

export async function createInviteAction(data: z.infer<typeof CreateInviteSchema>) {
  try {
    const { session } = await requireMasterPermission('INVITE_USERS');
    const validated = CreateInviteSchema.parse(data);
    
    const workspace = await getWorkspaceById(validated.workspaceId);
    if (!workspace) {
      return { success: false, error: 'Workspace not found' };
    }
    
    const token = generateToken(24);
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + validated.expiresInDays * 24 * 60 * 60 * 1000);
    
    const invite = {
      _id: new ObjectId(),
      email: validated.email,
      invitedBy: new ObjectId((session as any).user.id),
      role: validated.role,
      tokenHash,
      workspaceId: validated.workspaceId,
      expiresAt,
      createdAt: new Date()
    };
    
    await insertInvite(invite);
    
    const inviteUrl = `${protocol}://${rootDomain}/accept-invite/${token}`;
    await sendInviteEmail(validated.email, inviteUrl);
    
    await logAuditEvent({
      userId: new ObjectId((session as any).user.id),
      workspaceId: validated.workspaceId,
      action: 'INVITE_CREATE',
      resourceType: 'invite',
      resourceId: invite._id.toString(),
      metadata: { email: validated.email, role: validated.role, workspaceType: workspace.type },
      createdAt: new Date()
    });
    
    revalidatePath('/master/invites');
    return { success: true, data: invite };
  } catch (error) {
    console.error('Error creating invite:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create invite' };
  }
}

const BulkInviteSchema = z.object({
  emails: z.array(z.string().email()).min(1).max(100),
  workspaceId: z.string().transform((val) => new ObjectId(val)),
  role: z.enum(['OWNER', 'ADMIN', 'USER', 'VIEW_ONLY']),
  expiresInDays: z.number().min(1).max(30).optional().default(7)
});

export async function bulkInviteAction(data: z.infer<typeof BulkInviteSchema>) {
  try {
    const { session } = await requireMasterPermission('INVITE_USERS');
    const validated = BulkInviteSchema.parse(data);
    
    const workspace = await getWorkspaceById(validated.workspaceId);
    if (!workspace) {
      return { success: false, error: 'Workspace not found' };
    }
    
    const invites = [];
    const expiresAt = new Date(Date.now() + validated.expiresInDays * 24 * 60 * 60 * 1000);
    const invitedBy = new ObjectId((session as any).user.id);
    
    for (const email of validated.emails) {
      const token = generateToken(24);
      const tokenHash = hashToken(token);
      
      const invite = {
        _id: new ObjectId(),
        email,
        invitedBy,
        role: validated.role,
        tokenHash,
        workspaceId: validated.workspaceId,
        expiresAt,
        createdAt: new Date()
      };
      
      await insertInvite(invite);
      
      const inviteUrl = `${protocol}://${rootDomain}/accept-invite/${token}`;
      await sendInviteEmail(email, inviteUrl);
      
      invites.push(invite);
    }
    
    await logAuditEvent({
      userId: invitedBy,
      workspaceId: validated.workspaceId,
      action: 'INVITE_CREATE',
      resourceType: 'invite',
      resourceId: 'bulk',
      metadata: { 
        emailCount: validated.emails.length, 
        role: validated.role, 
        workspaceType: workspace.type 
      },
      createdAt: new Date()
    });
    
    revalidatePath('/master/invites');
    return { success: true, data: invites };
  } catch (error) {
    console.error('Error creating bulk invites:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create invites' };
  }
}

export async function resendInviteAction(inviteId: string) {
  try {
    const { session } = await requireMasterPermission('INVITE_USERS');
    
    const invite = await getInviteById(new ObjectId(inviteId));
    if (!invite) {
      return { success: false, error: 'Invite not found' };
    }
    
    if (invite.usedAt) {
      return { success: false, error: 'Invite already used' };
    }
    
    const token = generateToken(24);
    const inviteUrl = `${protocol}://${rootDomain}/accept-invite/${token}`;
    await sendInviteEmail(invite.email, inviteUrl);
    
    await logAuditEvent({
      userId: new ObjectId((session as any).user.id),
      workspaceId: invite.workspaceId,
      action: 'INVITE_CREATE',
      resourceType: 'invite',
      resourceId: invite._id.toString(),
      metadata: { email: invite.email, action: 'resend' },
      createdAt: new Date()
    });
    
    revalidatePath('/master/invites');
    return { success: true };
  } catch (error) {
    console.error('Error resending invite:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to resend invite' };
  }
}

export async function revokeInviteAction(inviteId: string) {
  try {
    const { session } = await requireMasterPermission('INVITE_USERS');
    
    const invite = await getInviteById(new ObjectId(inviteId));
    if (!invite) {
      return { success: false, error: 'Invite not found' };
    }
    
    await revokeInvite(invite._id);
    
    await logAuditEvent({
      userId: new ObjectId((session as any).user.id),
      workspaceId: invite.workspaceId,
      action: 'INVITE_REVOKE',
      resourceType: 'invite',
      resourceId: invite._id.toString(),
      metadata: { email: invite.email },
      createdAt: new Date()
    });
    
    revalidatePath('/master/invites');
    return { success: true };
  } catch (error) {
    console.error('Error revoking invite:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to revoke invite' };
  }
}

