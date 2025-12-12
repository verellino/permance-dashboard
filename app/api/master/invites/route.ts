import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/rbac';
import { getAllInvites, insertInvite, getInviteById } from '@/lib/models/invite';
import { getWorkspaceById } from '@/lib/models/workspace';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import crypto from 'crypto';
import { sendInviteEmail } from '@/lib/email';
import { protocol, rootDomain } from '@/lib/utils';
import { logAuditEvent } from '@/lib/models/audit-log';
import type { WorkspaceType } from '@/lib/models/workspace';
import type { UserRole } from '@/lib/models/user';

const INVITE_EXPIRY_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function generateToken(bytes = 24) {
  return crypto.randomBytes(bytes).toString('base64url');
}

const CreateInviteSchema = z.object({
  email: z.string().email(),
  workspaceId: z.string().transform((val) => new ObjectId(val)),
  role: z.enum(['OWNER', 'ADMIN', 'USER', 'VIEW_ONLY']),
  expiresInDays: z.number().min(1).max(30).optional().default(7)
});


/**
 * GET /api/master/invites
 * Get all invites with filtering
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'INVITE_USERS')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  
  const options = {
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    skip: searchParams.get('skip') ? parseInt(searchParams.get('skip')!) : 0,
    workspaceId: searchParams.get('workspaceId') ? new ObjectId(searchParams.get('workspaceId')!) : undefined,
    status: searchParams.get('status') as 'pending' | 'accepted' | 'expired' | undefined,
    role: searchParams.get('role') as UserRole | undefined,
    search: searchParams.get('search') || undefined
  };

  try {
    const invites = await getAllInvites(options);
    return NextResponse.json({ success: true, data: invites });
  } catch (error) {
    console.error('Error fetching invites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invites' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/master/invites
 * Create a new invite
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'INVITE_USERS')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = CreateInviteSchema.parse(body);
    
    // Verify workspace exists
    const workspace = await getWorkspaceById(validated.workspaceId);
    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
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
    
    return NextResponse.json({ success: true, data: invite }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating invite:', error);
    return NextResponse.json(
      { error: 'Failed to create invite' },
      { status: 500 }
    );
  }
}


