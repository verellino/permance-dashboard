import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/rbac';
import {
  getWorkspaceById,
  updateWorkspace,
  softDeleteWorkspace,
  checkSubdomainExists
} from '@/lib/models/workspace';
import { getMembershipsForWorkspace } from '@/lib/models/workspace-membership';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const UpdateClipperSchema = z.object({
  name: z.string().min(1).optional(),
  subdomain: z.string().regex(/^[a-z0-9-]+$/, 'Subdomain must be lowercase alphanumeric with dashes').optional(),
  parentWorkspaceId: z.string().optional().transform((val) => val ? new ObjectId(val) : null),
  settings: z.record(z.unknown()).optional()
});

/**
 * GET /api/master/clippers/[id]
 * Get a single CLIPPER workspace with members
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'MANAGE_CLIPPERS')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const workspaceId = new ObjectId(params.id);
    const workspace = await getWorkspaceById(workspaceId);
    
    if (!workspace || workspace.type !== 'CLIPPER') {
      return NextResponse.json({ error: 'Clipper not found' }, { status: 404 });
    }

    const members = await getMembershipsForWorkspace(workspaceId);
    
    return NextResponse.json({
      success: true,
      data: {
        ...workspace,
        members
      }
    });
  } catch (error) {
    console.error('Error fetching clipper:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clipper' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/master/clippers/[id]
 * Update a CLIPPER workspace
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'MANAGE_CLIPPERS')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const workspaceId = new ObjectId(params.id);
    const workspace = await getWorkspaceById(workspaceId);
    
    if (!workspace || workspace.type !== 'CLIPPER') {
      return NextResponse.json({ error: 'Clipper not found' }, { status: 404 });
    }

    const body = await request.json();
    const validated = UpdateClipperSchema.parse(body);
    
    // Check subdomain uniqueness if updating
    if (validated.subdomain && validated.subdomain !== workspace.subdomain) {
      const exists = await checkSubdomainExists(validated.subdomain, workspaceId);
      if (exists) {
        return NextResponse.json(
          { error: 'Subdomain already exists' },
          { status: 409 }
        );
      }
    }
    
    const updates: any = {};
    if (validated.name) updates.name = validated.name;
    if (validated.subdomain) updates.subdomain = validated.subdomain;
    if (validated.settings) updates.settings = validated.settings;
    if (validated.parentWorkspaceId !== undefined) updates.parentWorkspaceId = validated.parentWorkspaceId;
    
    await updateWorkspace(workspaceId, updates);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating clipper:', error);
    return NextResponse.json(
      { error: 'Failed to update clipper' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/master/clippers/[id]
 * Soft delete a CLIPPER workspace
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'MANAGE_CLIPPERS')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const workspaceId = new ObjectId(params.id);
    const workspace = await getWorkspaceById(workspaceId);
    
    if (!workspace || workspace.type !== 'CLIPPER') {
      return NextResponse.json({ error: 'Clipper not found' }, { status: 404 });
    }

    await softDeleteWorkspace(workspaceId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting clipper:', error);
    return NextResponse.json(
      { error: 'Failed to delete clipper' },
      { status: 500 }
    );
  }
}

