import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIPPER"
      title="Client Briefs"
      description="Requirements, brand guidelines, and reference reels."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Client briefs (placeholder)
      </div>
    </WorkspaceShell>
  );
}

