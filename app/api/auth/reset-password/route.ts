import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/models/user';
import { createToken } from '@/lib/auth/tokens';
import { sendPasswordReset } from '@/lib/email';
import { protocol, rootDomain } from '@/lib/utils';
import { rateLimit } from '@/lib/rate-limit';
import { logAuditEvent } from '@/lib/models/audit-log';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!rateLimit(`reset:${ip}`)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ success: true }); // do not leak existence
  }

  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  const token = await createToken(email, 'reset', expires);
  const url = `${protocol}://${rootDomain}/reset-password/${token}`;
  await sendPasswordReset(email, url);
  await logAuditEvent({
    userId: user._id,
    workspaceId: null,
    action: 'PASSWORD_RESET_REQUEST',
    resourceType: 'user',
    resourceId: user._id.toString(),
    metadata: { email },
    createdAt: new Date()
  });

  return NextResponse.json({ success: true });
}

