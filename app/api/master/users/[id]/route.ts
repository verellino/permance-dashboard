import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/rbac';
import { getUserById, updateUser, updateUserPassword } from '@/lib/models/user';
import { getMembershipsForUser } from '@/lib/models/workspace-membership';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

/**
 * GET /api/master/users/[id]
 * Get a single user with their memberships
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'MANAGE_USERS')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = new ObjectId(params.id);
    const user = await getUserById(userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const memberships = await getMembershipsForUser(userId);
    
    return NextResponse.json({
      success: true,
      data: {
        ...user,
        memberships
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/master/users/[id]
 * Update user information
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'MANAGE_USERS')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = new ObjectId(params.id);
    const body = await request.json();
    
    const updates: any = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.email !== undefined) updates.email = body.email;
    
    if (Object.keys(updates).length > 0) {
      await updateUser(userId, updates);
    }
    
    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      await updateUserPassword(userId, hashedPassword);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

