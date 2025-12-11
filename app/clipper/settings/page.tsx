import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIPPER"
      title="Settings"
      description="Profile, notifications, and API key."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Settings (placeholder)
      </div>
    </WorkspaceShell>
  );
}

