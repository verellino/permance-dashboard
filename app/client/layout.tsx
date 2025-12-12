import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { ClientShell } from '@/components/client-shell';

export default async function ClientLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const memberships = (session as any)?.memberships as
    | { workspaceType: string }[]
    | undefined;
  const clientMembership = memberships?.find((m) => m.workspaceType === 'CLIENT');

  if (!session || !clientMembership) {
    redirect('/login');
  }

  return <ClientShell>{children}</ClientShell>;
}

