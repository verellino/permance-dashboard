import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIPPER"
      title="Content Queue"
      description="To clip, needs revisions, uploaded items."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Content queue (placeholder)
      </div>
    </WorkspaceShell>
  );
}

