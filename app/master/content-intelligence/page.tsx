import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Content Intelligence"
      description="Viral predictors, category performance, and format insights."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Content intelligence (placeholder)
      </div>
    </WorkspaceShell>
  );
}

