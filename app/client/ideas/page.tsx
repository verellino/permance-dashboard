import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIENT"
      title="Ideas & Strategy"
      description="Idea board, inspiration, and strategy notes."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Ideas & strategy (placeholder)
      </div>
    </WorkspaceShell>
  );
}

