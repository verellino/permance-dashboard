import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export default async function ResetPasswordTokenPage({
  params
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <h1 className="text-2xl font-semibold">Set new password</h1>
      <div className="mt-6 rounded border p-6 shadow-sm bg-white">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}

