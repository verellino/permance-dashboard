import crypto from 'crypto';
import { notFound } from 'next/navigation';
import { findInviteByHash } from '@/lib/models/invite';
import { AcceptInviteForm } from '@/components/auth/accept-invite-form';

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export default async function AcceptInvitePage({
  params
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await findInviteByHash(hashToken(token));
  if (!invite || invite.usedAt || invite.expiresAt.getTime() < Date.now()) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <h1 className="text-2xl font-semibold">Accept invite</h1>
      <p className="text-gray-600">
        Workspace: {invite.workspaceId.toString()} — Role: {invite.role}
      </p>
      <div className="mt-6">
        <AcceptInviteForm token={token} email={invite.email} />
      </div>
    </div>
  );
}

