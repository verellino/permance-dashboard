import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Billing"
      description="Billing periods, clip usage, and payments."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Billing (placeholder)
      </div>
    </WorkspaceShell>
  );
}

