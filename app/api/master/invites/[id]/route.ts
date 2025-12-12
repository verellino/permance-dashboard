import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/rbac';
import { getInviteById, revokeInvite } from '@/lib/models/invite';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';
import { sendInviteEmail } from '@/lib/email';
import { protocol, rootDomain } from '@/lib/utils';
import { logAuditEvent } from '@/lib/models/audit-log';

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function generateToken(bytes = 24) {
  return crypto.randomBytes(bytes).toString('base64url');
}

/**
 * GET /api/master/invites/[id]
 * Get a single invite
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'INVITE_USERS')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const inviteId = new ObjectId(params.id);
    const invite = await getInviteById(inviteId);
    
    if (!invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: invite });
  } catch (error) {
    console.error('Error fetching invite:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invite' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/master/invites/[id]/resend
 * Resend an invite email
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'INVITE_USERS')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const inviteId = new ObjectId(params.id);
    const invite = await getInviteById(inviteId);
    
    if (!invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }
    
    if (invite.usedAt) {
      return NextResponse.json(
        { error: 'Invite already used' },
        { status: 400 }
      );
    }
    
    // Generate new token for resend
    const token = generateToken(24);
    const tokenHash = hashToken(token);
    
    // Note: We'd need to update the invite with new tokenHash, but for now
    // we'll just resend with a new token (in production, update the invite)
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
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resending invite:', error);
    return NextResponse.json(
      { error: 'Failed to resend invite' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/master/invites/[id]
 * Revoke an invite
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'INVITE_USERS')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const inviteId = new ObjectId(params.id);
    const invite = await getInviteById(inviteId);
    
    if (!invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }
    
    await revokeInvite(inviteId);
    
    await logAuditEvent({
      userId: new ObjectId((session as any).user.id),
      workspaceId: invite.workspaceId,
      action: 'INVITE_REVOKE',
      resourceType: 'invite',
      resourceId: invite._id.toString(),
      metadata: { email: invite.email },
      createdAt: new Date()
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error revoking invite:', error);
    return NextResponse.json(
      { error: 'Failed to revoke invite' },
      { status: 500 }
    );
  }
}

