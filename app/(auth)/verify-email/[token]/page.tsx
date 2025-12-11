import { notFound } from 'next/navigation';
import { consumeToken } from '@/lib/auth/tokens';
import { findUserByEmail, verifyUserEmail } from '@/lib/models/user';

export default async function VerifyEmailPage({
  params
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const identifier = await consumeToken(token, 'verify');
  if (!identifier) {
    notFound();
  }
  const user = await findUserByEmail(identifier);
  if (!user) {
    notFound();
  }
  await verifyUserEmail(user._id);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <h1 className="text-2xl font-semibold">Email verified</h1>
      <p className="text-gray-600">You can now sign in with your account.</p>
    </div>
  );
}

