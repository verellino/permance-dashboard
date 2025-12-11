import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIENT"
      title="Tasks"
      description="Review requests, approvals, and assignments."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Tasks list (placeholder)
      </div>
    </WorkspaceShell>
  );
}

