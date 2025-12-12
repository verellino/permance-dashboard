import { WorkspaceShell } from '@/components/workspace-shell';
import { TrialTable } from './trial-table';
import { mockPosts } from '../data';

/**
 * Trial Reels Page (MASTER workspace)
 * Shows trial reels awaiting approval
 */
export default function TrialReelsPage() {
  // Filter to only trial posts
  const trialReels = mockPosts.filter((post) => post.is_trial);

  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Trial Reels"
      description="Review and approve trial content submissions"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {trialReels.length} trial reel{trialReels.length !== 1 ? 's' : ''} pending review
          </p>
        </div>
        <TrialTable initialData={trialReels} />
      </div>
    </WorkspaceShell>
  );
}
