import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <h1 className="text-3xl font-semibold">Signup is invite-only</h1>
      <p className="mt-2 text-gray-600">
        Please use your invite link to continue. If you believe you should have
        access, contact an admin to receive an invitation.
      </p>
      <div className="mt-6">
        <Link href="/login" className="text-blue-600">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

