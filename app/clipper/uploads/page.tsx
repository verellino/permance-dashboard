import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIPPER"
      title="Uploads"
      description="Upload clips and track revisions."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Uploads view (placeholder)
      </div>
    </WorkspaceShell>
  );
}

