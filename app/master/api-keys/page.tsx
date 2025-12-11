import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="API Keys"
      description="Manage API keys for integrations."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        API keys (placeholder)
      </div>
    </WorkspaceShell>
  );
}

