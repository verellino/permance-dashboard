import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIPPER"
      title="My Tasks"
      description="Assigned clipping/editing tasks."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Task list (placeholder)
      </div>
    </WorkspaceShell>
  );
}

