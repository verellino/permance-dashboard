import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIENT"
      title="Account"
      description="User settings and logout."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Account settings (placeholder)
      </div>
    </WorkspaceShell>
  );
}

