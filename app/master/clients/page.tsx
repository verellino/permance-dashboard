import { WorkspaceShell } from '@/components/workspace-shell';
import { ClientsTable } from './clients-table';
import { getClientsData } from './data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Page() {
  const clients = await getClientsData({ limit: 100 });

  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Clients"
      description="Manage client workspaces and view their status."
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Link href="/master/clients/new">
            <Button>Create Client</Button>
          </Link>
        </div>
        <ClientsTable initialData={clients as any} />
      </div>
    </WorkspaceShell>
  );
}

