import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Clippers"
      description="Manage clipper accounts and assignments."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Clippers list (placeholder)
      </div>
    </WorkspaceShell>
  );
}

