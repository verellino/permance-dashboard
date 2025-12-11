import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIENT"
      title="Clip Pipeline"
      description="Upcoming, in review, and completed clips."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Clip pipeline (placeholder)
      </div>
    </WorkspaceShell>
  );
}

