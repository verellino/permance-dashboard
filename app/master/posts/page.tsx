import { WorkspaceShell } from '@/components/workspace-shell';
import { PostsTable } from './posts-table';
import { mockPosts } from './data';

/**
 * All Posts Page (MASTER workspace)
 * Shows published content across all clients
 */
export default function PostsPage() {
  // Filter to only published posts (not trials)
  const publishedPosts = mockPosts.filter((post) => !post.is_trial);

  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="All Posts"
      description="Published content across all clients"
    >
      <PostsTable initialData={publishedPosts} />
    </WorkspaceShell>
  );
}
