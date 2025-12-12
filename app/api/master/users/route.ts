import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/rbac';
import { getAllUsersWithMemberships } from '@/lib/models/workspace-membership';
import { ObjectId } from 'mongodb';
import type { WorkspaceType } from '@/lib/models/workspace';
import type { UserRole } from '@/lib/models/user';

/**
 * GET /api/master/users
 * Get all users with their memberships
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'MANAGE_USERS')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  
  const options = {
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    skip: searchParams.get('skip') ? parseInt(searchParams.get('skip')!) : 0,
    workspaceType: searchParams.get('workspaceType') as WorkspaceType | null,
    role: searchParams.get('role') as UserRole | null,
    search: searchParams.get('search') || undefined
  };

  try {
    const users = await getAllUsersWithMemberships(options);
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

