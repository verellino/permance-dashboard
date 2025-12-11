import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { consumeToken } from '@/lib/auth/tokens';
import { findUserByEmail, updateUserPassword } from '@/lib/models/user';
import { logAuditEvent } from '@/lib/models/audit-log';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const { password } = await request.json();

  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    );
  }

  const identifier = await consumeToken(token, 'reset');
  if (!identifier) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 400 }
    );
  }

  const user = await findUserByEmail(identifier);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const hashed = await bcrypt.hash(password, 10);
  await updateUserPassword(user._id, hashed);
  await logAuditEvent({
    userId: user._id,
    workspaceId: null,
    action: 'PASSWORD_RESET_COMPLETE',
    resourceType: 'user',
    resourceId: user._id.toString(),
    createdAt: new Date()
  });
  return NextResponse.json({ success: true });
}

