import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { protocol, rootDomain } from '@/lib/utils';

export default async function HomePage() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  const memberships =
    (session as any).memberships as
      | {
          workspaceId: string;
          workspaceType: string;
          role: string;
          subdomain?: string | null;
        }[]
      | undefined;

  // If user has a MASTER membership, send them to master dashboard on root domain.
  const masterMember = memberships?.find(
    (m) => m.workspaceType === 'MASTER'
  );
  if (masterMember) {
    redirect('/master/dashboard');
  }

  const clientMember = memberships?.find(
    (m) => m.workspaceType === 'CLIENT' && m.subdomain
  );
  if (clientMember?.subdomain) {
    redirect(
      `${protocol}://${clientMember.subdomain}.${rootDomain}/client/dashboard`
    );
  }

  const clipperMember = memberships?.find(
    (m) => m.workspaceType === 'CLIPPER' && m.subdomain
  );
  if (clipperMember?.subdomain) {
    redirect(
      `${protocol}://${clipperMember.subdomain}.${rootDomain}/clipper/dashboard`
    );
  }

  // No master membership on root → they don't belong here.
  redirect('/no-access');
}
