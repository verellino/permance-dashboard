import { WorkspaceShell } from '@/components/workspace-shell';
import { ClippersTable } from './clippers-table';
import { getClippersData } from './data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Page() {
  const clippers = await getClippersData({ limit: 100 });

  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Clippers"
      description="Manage clipper workspaces and accounts."
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Link href="/master/clippers/new">
            <Button>Create Clipper</Button>
          </Link>
        </div>
        <ClippersTable initialData={clippers as any} />
      </div>
    </WorkspaceShell>
  );
}
