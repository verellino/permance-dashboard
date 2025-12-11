import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { SubdomainForm } from './subdomain-form';
import { rootDomain } from '@/lib/utils';

export default async function HomePage() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  const memberships =
    (session as any).memberships as
      | { workspaceId: string; workspaceType: string; role: string }[]
      | undefined;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 relative">
      <div className="absolute top-4 right-4">
        <Link
          href="/admin"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Admin
        </Link>
      </div>
    </div>
  );
}
