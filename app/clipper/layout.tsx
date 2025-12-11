import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { hasRole } from '@/lib/rbac';

export default async function ClipperLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const memberships = (session as any)?.memberships as
    | { workspaceType: string; role: any }[]
    | undefined;
  const clipperMembership = memberships?.find(
    (m) => m.workspaceType === 'CLIPPER'
  );

  if (
    !session ||
    !clipperMembership ||
    !hasRole(clipperMembership.role, 'USER')
  ) {
    redirect('/login');
  }

  return <div className="min-h-screen bg-gray-50 p-6">{children}</div>;
}

