import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasRole, type Permission } from '@/lib/rbac';

type Membership = {
  workspaceId: string;
  workspaceType: string;
  role: any;
};

export async function requireAuth(workspaceType?: string) {
  const session = await auth();
  const memberships = (session as any)?.memberships as Membership[] | undefined;
  const membership = workspaceType
    ? memberships?.find((m) => m.workspaceType === workspaceType)
    : memberships?.[0];

  if (!session || !membership) {
    return { authorized: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { authorized: true, session, membership };
}

export function ensureRole(
  membership: Membership,
  role: any,
  failureMessage = 'Forbidden'
) {
  if (!hasRole(membership.role, role)) {
    return NextResponse.json({ error: failureMessage }, { status: 403 });
  }
  return null;
}

export function ensurePermission(
  membership: Membership,
  workspaceType: any,
  permission: Permission,
  failureMessage = 'Forbidden'
) {
  if (!membership || membership.workspaceType !== workspaceType) {
    return NextResponse.json({ error: failureMessage }, { status: 403 });
  }
  return null;
}

