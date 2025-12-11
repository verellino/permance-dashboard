import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasRole } from '@/lib/rbac';

export async function POST(request: Request) {
  const session = await auth();
  const workspaceId = request.headers.get('x-workspace-id');
  const memberships = (session as any)?.memberships as
    | { workspaceId: string; workspaceType: string; role: any }[]
    | undefined;
  const membership = memberships?.find(
    (m) => m.workspaceType === 'CLIPPER' && m.workspaceId === workspaceId
  );

  if (!session || !membership || !hasRole(membership.role, 'USER')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}

