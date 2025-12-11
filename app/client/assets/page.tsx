import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIENT"
      title="Brand & Assets"
      description="Brand preferences, assets, and files."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Assets (placeholder)
      </div>
    </WorkspaceShell>
  );
}

