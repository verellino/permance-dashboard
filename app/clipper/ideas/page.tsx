import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIPPER"
      title="Ideas & Inspiration"
      description="Idea assignments, hooks, and viral examples."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Ideas & inspiration (placeholder)
      </div>
    </WorkspaceShell>
  );
}

