import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIENT"
      title="Workspace Settings"
      description="Branding and integrations for this client workspace."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Client workspace settings (placeholder)
      </div>
    </WorkspaceShell>
  );
}

