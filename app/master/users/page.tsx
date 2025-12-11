import { WorkspaceShell } from '@/components/workspace-shell';

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Users & Roles"
      description="Manage agency users and roles."
    >
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Users & roles (placeholder)
      </div>
    </WorkspaceShell>
  );
}

