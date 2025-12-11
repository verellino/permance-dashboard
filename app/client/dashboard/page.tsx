import { WorkspaceShell } from '@/components/workspace-shell';

export default function ClientDashboard() {
  return (
    <WorkspaceShell
      workspaceType="CLIENT"
      title="Client Dashboard"
      description="KPIs, content performance, and pipeline."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Client dashboard content (placeholder)
      </div>
    </WorkspaceShell>
  );
}

