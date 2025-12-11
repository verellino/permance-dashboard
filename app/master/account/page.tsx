import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Account"
      description="User preferences and logout."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Account settings (placeholder)
      </div>
    </WorkspaceShell>
  );
}

