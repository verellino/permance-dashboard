'use client';

import { DataTable } from '@/components/data-table';
import { postsColumns } from './columns';
import { PostDocument } from '@/lib/models/post';

interface PostsTableProps {
  initialData: PostDocument[];
}

/**
 * Client component for displaying posts in a data table
 * Uses mock data initially, ready for API integration
 */
export function PostsTable({ initialData }: PostsTableProps) {
  // TODO: Add state management for future API integration
  // const [data, setData] = useState<PostDocument[]>(initialData);
  // const [loading, setLoading] = useState(false);
  //
  // useEffect(() => {
  //   async function fetchPosts() {
  //     setLoading(true);
  //     const res = await fetch('/api/master/posts');
  //     const json = await res.json();
  //     setData(json.data);
  //     setLoading(false);
  //   }
  //   fetchPosts();
  // }, []);
  //
  // if (loading) return <div>Loading...</div>;

  return (
    <DataTable
      data={initialData}
      columns={postsColumns}
      getRowId={(row) => row._id.toString()}
    />
  );
}
