'use client';

import { DataTable } from '@/components/data-table';
import { trialReelsColumns } from './columns';
import { PostDocument } from '@/lib/models/post';

interface TrialTableProps {
  initialData: PostDocument[];
}

/**
 * Client component for displaying trial reels in a data table
 * Only shows posts where is_trial = true
 */
export function TrialTable({ initialData }: TrialTableProps) {
  // TODO: Add state management for future API integration
  // const [data, setData] = useState<PostDocument[]>(initialData);
  // const [loading, setLoading] = useState(false);
  //
  // async function refetchData() {
  //   setLoading(true);
  //   const res = await fetch('/api/master/posts?is_trial=true');
  //   const json = await res.json();
  //   setData(json.data);
  //   setLoading(false);
  // }
  //
  // if (loading) return <div>Loading...</div>;

  return (
    <DataTable
      data={initialData}
      columns={trialReelsColumns}
      getRowId={(row) => row._id.toString()}
    />
  );
}
