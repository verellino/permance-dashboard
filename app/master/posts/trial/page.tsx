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
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Trial Reels</h1>
        <p className="text-muted-foreground">Review and approve trial content submissions</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {trialReels.length} trial reel{trialReels.length !== 1 ? 's' : ''} pending review
          </p>
        </div>
        <TrialTable initialData={trialReels} />
      </div>
    </>
  );
}
