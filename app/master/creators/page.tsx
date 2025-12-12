import { WorkspaceShell } from '@/components/workspace-shell';
import { CreatorsTable } from './creators-table';
import { mockCreators } from './data';

/**
 * Creators List Page (MASTER workspace)
 * Shows all content creators with performance metrics and finance info
 */
export default function CreatorsPage() {
  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Creators"
      description="Content creators, performance metrics, and payment tracking"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {mockCreators.length} creator{mockCreators.length !== 1 ? 's' : ''} in system
          </p>
        </div>
        <CreatorsTable initialData={mockCreators} />
      </div>
    </WorkspaceShell>
  );
}
