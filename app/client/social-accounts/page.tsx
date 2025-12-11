import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIENT"
      title="Social Accounts"
      description="Manage connected social accounts."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Social accounts (placeholder)
      </div>
    </WorkspaceShell>
  );
}

