import { WorkspaceShell } from '@/components/workspace-shell';
import { ContentTable } from './content-table';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Content"
      description="All posted content across all clients."
    >
      <ContentTable />
    </WorkspaceShell>
  );
}

