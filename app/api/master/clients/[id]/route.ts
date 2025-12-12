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

const UpdateClientSchema = z.object({
  name: z.string().min(1).optional(),
  subdomain: z.string().regex(/^[a-z0-9-]+$/, 'Subdomain must be lowercase alphanumeric with dashes').optional(),
  settings: z.record(z.unknown()).optional()
});

/**
 * GET /api/master/clients/[id]
 * Get a single CLIENT workspace with members
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
    
    return NextResponse.json({
      success: true,
      data: {
        ...workspace,
        members
      }
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/master/clients/[id]
 * Update a CLIENT workspace
 */
export async function PATCH(
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
    const validated = UpdateClientSchema.parse(body);
    
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
    
    await updateWorkspace(workspaceId, validated);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/master/clients/[id]
 * Soft delete a CLIENT workspace
 */
export async function DELETE(
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

    await softDeleteWorkspace(workspaceId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}

