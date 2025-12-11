import { NextResponse } from 'next/server';
import { acceptInviteAction } from '@/app/actions/invites';

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await acceptInviteAction(null, formData);
  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result);
}

