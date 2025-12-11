import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Audit Logs"
      description="Security and activity logs."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Audit logs (placeholder)
      </div>
    </WorkspaceShell>
  );
}

