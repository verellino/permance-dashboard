import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { hasRole } from '@/lib/rbac';
import { MasterShell } from '@/components/master-shell';

export default async function MasterLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const memberships = (session as any)?.memberships as
    | { workspaceType: string; role: any }[]
    | undefined;
  const masterMembership = memberships?.find(
    (m) => m.workspaceType === 'MASTER'
  );

  if (!session || !masterMembership || !hasRole(masterMembership.role, 'ADMIN')) {
    redirect('/login');
  }

  return <MasterShell>{children}</MasterShell>;
}