import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIENT"
      title="Insights"
      description="Viral analysis, format performance, and category trends."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Insights (placeholder)
      </div>
    </WorkspaceShell>
  );
}

