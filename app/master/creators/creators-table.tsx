'use client';

import { DataTable } from '@/components/data-table';
import { creatorsColumns } from './columns';
import { CreatorDocument } from '@/lib/models/creator';

interface CreatorsTableProps {
  initialData: CreatorDocument[];
}

/**
 * Client component for displaying creators in a data table
 * Uses mock data initially, ready for API integration
 */
export function CreatorsTable({ initialData }: CreatorsTableProps) {
  // TODO: Add state management for future API integration
  // const [data, setData] = useState<CreatorDocument[]>(initialData);
  // const [loading, setLoading] = useState(false);
  //
  // useEffect(() => {
  //   async function fetchCreators() {
  //     setLoading(true);
  //     const res = await fetch('/api/master/creators');
  //     const json = await res.json();
  //     setData(json.data);
  //     setLoading(false);
  //   }
  //   fetchCreators();
  // }, []);
  //
  // if (loading) return <div>Loading...</div>;

  return (
    <DataTable
      data={initialData}
      columns={creatorsColumns}
      getRowId={(row) => row._id.toString()}
    />
  );
}
