import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';

export async function GET(request: Request) {
  const session = await auth();
  const workspaceId = request.headers.get('x-workspace-id');
  const memberships = (session as any)?.memberships as
    | { workspaceId: string; workspaceType: string }[]
    | undefined;
  const membership = memberships?.find(
    (m) => m.workspaceType === 'CLIENT' && m.workspaceId === workspaceId
  );

  if (!session || !membership) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ data: [], message: 'Client content' });
}

