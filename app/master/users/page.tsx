import { WorkspaceShell } from '@/components/workspace-shell';
import { UsersTable } from './users-table';
import { getUsersData } from './data';

export default async function Page() {
  const users = await getUsersData({ limit: 100 });

  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Users & Roles"
      description="Manage agency users and roles."
    >
      <UsersTable initialData={users as any} />
    </WorkspaceShell>
  );
}

