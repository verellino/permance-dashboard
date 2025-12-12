import { WorkspaceShell } from '@/components/workspace-shell';
import { InvitesTable } from './invites-table';
import { getInvitesData } from './data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Page() {
  const invites = await getInvitesData({ limit: 100 });

  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Invites"
      description="Centralized invite management for the agency."
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Link href="/master/invites/new">
            <Button>Create Invite</Button>
          </Link>
        </div>
        <InvitesTable initialData={invites} />
      </div>
    </WorkspaceShell>
  );
}

