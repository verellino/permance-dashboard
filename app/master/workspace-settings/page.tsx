import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Workspace Settings"
      description="Branding, domain settings, and agency preferences."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Master workspace settings (placeholder)
      </div>
    </WorkspaceShell>
  );
}

