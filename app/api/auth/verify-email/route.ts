import { NextResponse } from 'next/server';
import { consumeToken } from '@/lib/auth/tokens';
import { findUserByEmail, verifyUserEmail } from '@/lib/models/user';
import { logAuditEvent } from '@/lib/models/audit-log';

export async function POST(request: Request) {
  const { token } = await request.json();
  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  const identifier = await consumeToken(token, 'verify');
  if (!identifier) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  const user = await findUserByEmail(identifier);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  await verifyUserEmail(user._id);
  await logAuditEvent({
    userId: user._id,
    workspaceId: null,
    action: 'EMAIL_VERIFY',
    resourceType: 'user',
    resourceId: user._id.toString(),
    createdAt: new Date()
  });
  return NextResponse.json({ success: true });
}

