import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIENT"
      title="Content Library"
      description="All posted content with filters and search."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Content library (placeholder)
      </div>
    </WorkspaceShell>
  );
}

