import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="CLIENT"
      title="Invites"
      description="Invite client team members."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Client invites (placeholder)
      </div>
    </WorkspaceShell>
  );
}

