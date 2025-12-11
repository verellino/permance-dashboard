import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIPPER"
      title="Account"
      description="Profile and logout."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Account settings (placeholder)
      </div>
    </WorkspaceShell>
  );
}

