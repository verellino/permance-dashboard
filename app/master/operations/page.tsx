import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Operations"
      description="Assignment queue, clipper activity, approvals, and QC."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Operations (placeholder)
      </div>
    </WorkspaceShell>
  );
}

