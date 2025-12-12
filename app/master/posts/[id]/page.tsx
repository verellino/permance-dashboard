import { notFound } from 'next/navigation';
import { WorkspaceShell } from '@/components/workspace-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockPosts } from '../data';
import {
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandYoutube,
  IconEye,
  IconHeart,
  IconMessage,
  IconShare,
  IconTrendingUp,
  IconExternalLink,
} from '@tabler/icons-react';
import Link from 'next/link';
import { PostEditDialog } from './post-edit-dialog';

/**
 * Post Detail Page
 * Shows comprehensive post information with metrics, AI analysis, and editable fields
 */
export default function PostDetailPage({ params }: { params: { id: string } }) {
  // Find the post by ID from mock data
  // TODO: Replace with actual database query when ready
  const post = mockPosts.find((p) => p._id.toString() === params.id);

  if (!post) {
    notFound();
  }

  // Platform icon
  const PlatformIcon =
    post.platform === 'Instagram'
      ? IconBrandInstagram
      : post.platform === 'TikTok'
      ? IconBrandTiktok
      : IconBrandYoutube;

  // Processing status color
  const statusVariant =
    post.processing_status === 'completed'
      ? 'default'
      : post.processing_status === 'processing'
      ? 'secondary'
      : post.processing_status === 'failed'
      ? 'destructive'
      : 'outline';

  return (
    <WorkspaceShell workspaceType="MASTER" title="Post Details" description="View and manage post information">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {post.platform && <PlatformIcon className="h-5 w-5" />}
              <h2 className="text-2xl font-bold">{post.username || 'Unknown Creator'}</h2>
            </div>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              <IconExternalLink className="h-3 w-3" />
              View Original Post
            </a>
          </div>
          <div className="flex gap-2">
            <Badge variant={post.is_trial ? 'secondary' : 'default'}>
              {post.is_trial ? 'Trial' : 'Published'}
            </Badge>
            <Badge variant={statusVariant}>{post.processing_status}</Badge>
          </div>
        </div>

        <Separator />

        {/* Metrics Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Views</CardTitle>
              <IconEye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{post.views?.toLocaleString() || '—'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Likes</CardTitle>
              <IconHeart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{post.likes?.toLocaleString() || '—'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comments</CardTitle>
              <IconMessage className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{post.comments?.toLocaleString() || '—'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shares</CardTitle>
              <IconShare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{post.shares?.toLocaleString() || '—'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {post.engagement_rate ? `${post.engagement_rate.toFixed(2)}%` : '—'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout for Details */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* AI Analysis Section */}
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis</CardTitle>
              <CardDescription>Automated content analysis and categorization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p className="text-base">
                  {post.category ? (
                    <Badge variant="secondary" className="mt-1">
                      {post.category}
                    </Badge>
                  ) : (
                    '—'
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Subcategories</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {post.subcategory && post.subcategory.length > 0 ? (
                    post.subcategory.map((sub, i) => (
                      <Badge key={i} variant="outline">
                        {sub}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm">—</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Reel Style</p>
                <p className="text-base">{post.reel_style || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Idea Concept</p>
                <p className="text-base italic">{post.idea_concept || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Content Type</p>
                <p className="text-base">{post.content_type || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Base Format</p>
                <p className="text-base">{post.base_format || '—'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Post Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Post Information</CardTitle>
              <CardDescription>Metadata and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Post Date</p>
                <p className="text-base">
                  {post.post_date
                    ? new Date(post.post_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '—'}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-base">
                  {post.last_updated
                    ? new Date(post.last_updated).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—'}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Post ID</p>
                <p className="text-base font-mono text-sm">{post.post_id || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing Status</p>
                <Badge variant={statusVariant} className="mt-1">
                  {post.processing_status}
                </Badge>
              </div>

              {post.is_trial && post.added_date && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Added Date</p>
                  <p className="text-base">
                    {new Date(post.added_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Frontend-Managed Fields Section */}
        <Card>
          <CardHeader>
            <CardTitle>Management</CardTitle>
            <CardDescription>Business logic and assignment fields (editable)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <p className="text-base">{post.type || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Belongs To</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {post.belongs_to && post.belongs_to.length > 0 ? (
                    post.belongs_to.map((board, i) => (
                      <Badge key={i} variant="outline">
                        {board}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm">—</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Finance Item ID</p>
                <p className="text-base font-mono text-sm">{post.finance_item_id || '—'}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <PostEditDialog post={post} />
              <Button variant="destructive">Delete Post</Button>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="flex justify-start">
          <Link href={post.is_trial ? '/master/posts/trial' : '/master/posts'}>
            <Button variant="ghost">← Back to {post.is_trial ? 'Trial Reels' : 'Posts'}</Button>
          </Link>
        </div>
      </div>
    </WorkspaceShell>
  );
}
