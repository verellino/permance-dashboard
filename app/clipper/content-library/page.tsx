import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIPPER"
      title="Content Library"
      description="Read-only posted client content for reference."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Content library (placeholder)
      </div>
    </WorkspaceShell>
  );
}

