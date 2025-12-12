import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/rbac';
import { getWorkspaceById } from '@/lib/models/workspace';
import {
  getMembershipsForWorkspace,
  updateMembershipRole,
  removeMembership,
  upsertMembership
} from '@/lib/models/workspace-membership';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import type { UserRole } from '@/lib/models/user';

const AddMemberSchema = z.object({
  userId: z.string().transform((val) => new ObjectId(val)),
  role: z.enum(['OWNER', 'ADMIN', 'USER', 'VIEW_ONLY'])
});

const UpdateMemberRoleSchema = z.object({
  role: z.enum(['OWNER', 'ADMIN', 'USER', 'VIEW_ONLY'])
});

/**
 * GET /api/master/clients/[id]/members
 * Get all members of a CLIENT workspace
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'MANAGE_CLIENTS')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const workspaceId = new ObjectId(params.id);
    const workspace = await getWorkspaceById(workspaceId);
    
    if (!workspace || workspace.type !== 'CLIENT') {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const members = await getMembershipsForWorkspace(workspaceId);
    
    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/master/clients/[id]/members
 * Add a member to a CLIENT workspace
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'MANAGE_CLIENTS')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const workspaceId = new ObjectId(params.id);
    const workspace = await getWorkspaceById(workspaceId);
    
    if (!workspace || workspace.type !== 'CLIENT') {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const body = await request.json();
    const validated = AddMemberSchema.parse(body);
    
    await upsertMembership({
      userId: validated.userId,
      workspaceId,
      role: validated.role,
      workspaceType: 'CLIENT',
      invitedBy: new ObjectId((session as any).user.id)
    });
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error adding member:', error);
    return NextResponse.json(
      { error: 'Failed to add member' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/master/clients/[id]/members/[userId]
 * Update a member's role
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; userId: string } }
) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'MANAGE_CLIENTS')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const workspaceId = new ObjectId(params.id);
    const userId = new ObjectId(params.userId);
    const workspace = await getWorkspaceById(workspaceId);
    
    if (!workspace || workspace.type !== 'CLIENT') {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const body = await request.json();
    const validated = UpdateMemberRoleSchema.parse(body);
    
    await updateMembershipRole(userId, workspaceId, validated.role);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating member role:', error);
    return NextResponse.json(
      { error: 'Failed to update member role' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/master/clients/[id]/members/[userId]
 * Remove a member from a CLIENT workspace
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; userId: string } }
) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'MANAGE_CLIENTS')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const workspaceId = new ObjectId(params.id);
    const userId = new ObjectId(params.userId);
    const workspace = await getWorkspaceById(workspaceId);
    
    if (!workspace || workspace.type !== 'CLIENT') {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    await removeMembership(userId, workspaceId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json(
      { error: 'Failed to remove member' },
      { status: 500 }
    );
  }
}

