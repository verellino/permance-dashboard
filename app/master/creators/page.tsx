import { CreatorsTable } from './creators-table';
import { mockCreators } from './data';

/**
 * Creators List Page (MASTER workspace)
 * Shows all content creators with performance metrics and finance info
 */
export default function CreatorsPage() {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Creators</h1>
        <p className="text-muted-foreground">Content creators, performance metrics, and payment tracking</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {mockCreators.length} creator{mockCreators.length !== 1 ? 's' : ''} in system
          </p>
        </div>
        <CreatorsTable initialData={mockCreators} />
      </div>
    </>
  );
}
