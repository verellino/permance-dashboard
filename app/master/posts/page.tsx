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
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">All Posts</h1>
        <p className="text-muted-foreground">Published content across all clients</p>
      </div>
      <PostsTable initialData={publishedPosts} />
    </>
  );
}
