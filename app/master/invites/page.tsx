import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Invites"
      description="Centralized invite management for the agency."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Invites management (placeholder)
      </div>
    </WorkspaceShell>
  );
}

