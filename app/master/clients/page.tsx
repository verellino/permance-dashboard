import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Clients"
      description="Manage client workspaces and view their status."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Clients list (placeholder)
      </div>
    </WorkspaceShell>
  );
}

