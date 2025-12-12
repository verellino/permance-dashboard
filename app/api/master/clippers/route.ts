import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/rbac';
import { getWorkspacesByType, createWorkspace, checkSubdomainExists } from '@/lib/models/workspace';
import { getMembershipsForWorkspace } from '@/lib/models/workspace-membership';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const CreateClipperSchema = z.object({
  name: z.string().min(1),
  subdomain: z.string().regex(/^[a-z0-9-]+$/, 'Subdomain must be lowercase alphanumeric with dashes'),
  parentWorkspaceId: z.string().optional().transform((val) => val ? new ObjectId(val) : null)
});

/**
 * GET /api/master/clippers
 * Get all CLIPPER workspaces
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'MANAGE_CLIPPERS')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  
  const options = {
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    skip: searchParams.get('skip') ? parseInt(searchParams.get('skip')!) : 0,
    includeDeleted: searchParams.get('includeDeleted') === 'true',
    search: searchParams.get('search') || undefined
  };

  try {
    const workspaces = await getWorkspacesByType('CLIPPER', options);
    
    // Enrich with member counts
    const workspacesWithCounts = await Promise.all(
      workspaces.map(async (workspace) => {
        const members = await getMembershipsForWorkspace(workspace._id);
        return {
          ...workspace,
          memberCount: members.length
        };
      })
    );
    
    return NextResponse.json({ success: true, data: workspacesWithCounts });
  } catch (error) {
    console.error('Error fetching clippers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clippers' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/master/clippers
 * Create a new CLIPPER workspace
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'MANAGE_CLIPPERS')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = CreateClipperSchema.parse(body);
    
    // Check if subdomain already exists
    const exists = await checkSubdomainExists(validated.subdomain);
    if (exists) {
      return NextResponse.json(
        { error: 'Subdomain already exists' },
        { status: 409 }
      );
    }
    
    const workspace = await createWorkspace({
      name: validated.name,
      subdomain: validated.subdomain,
      type: 'CLIPPER',
      settings: {},
      parentWorkspaceId: validated.parentWorkspaceId
    });
    
    return NextResponse.json({ success: true, data: workspace }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating clipper:', error);
    return NextResponse.json(
      { error: 'Failed to create clipper' },
      { status: 500 }
    );
  }
}

