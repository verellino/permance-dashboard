import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasRole } from '@/lib/rbac';

export async function GET() {
  const session = await auth();
  const memberships = (session as any)?.memberships as
    | { workspaceType: string; role: any }[]
    | undefined;
  const membership = memberships?.find((m) => m.workspaceType === 'MASTER');
  if (!session || !membership || !hasRole(membership.role, 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ data: [], message: 'Master clients list' });
}

