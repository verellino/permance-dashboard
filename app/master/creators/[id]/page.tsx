import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { mockCreators } from '../data';
import { mockPosts } from '../../posts/data';
import {
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandYoutube,
  IconUsers,
  IconUserPlus,
  IconFiles,
  IconEye,
  IconHeart,
  IconTrendingUp,
  IconCheck,
  IconX,
  IconExternalLink,
} from '@tabler/icons-react';
import Link from 'next/link';

/**
 * Creator Detail Page
 * Shows comprehensive creator information with profile, metrics, finance, and recent posts
 */
export default function CreatorDetailPage({ params }: { params: { id: string } }) {
  // Find the creator by ID from mock data
  const creator = mockCreators.find((c) => c._id.toString() === params.id);

  if (!creator) {
    notFound();
  }

  // Get recent posts by this creator
  const creatorPosts = mockPosts.filter(
    (p) => p.username?.toLowerCase() === creator.username.toLowerCase()
  );

  // Platform icon
  const PlatformIcon =
    creator.platform === 'Instagram'
      ? IconBrandInstagram
      : creator.platform === 'TikTok'
      ? IconBrandTiktok
      : IconBrandYoutube;

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Creator Profile</h1>
        <p className="text-muted-foreground">Detailed creator information and performance metrics</p>
      </div>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={creator.profile_pic_url} alt={creator.username} />
            <AvatarFallback className="text-2xl">
              {creator.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold">{creator.username}</h2>
              {creator.is_verified && (
                <Badge variant="default" className="gap-1">
                  <IconCheck className="h-3 w-3" />
                  Verified
                </Badge>
              )}
              {creator.platform && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <PlatformIcon className="h-4 w-4" />
                  <span className="text-sm">{creator.platform}</span>
                </div>
              )}
            </div>

            {creator.full_name && <p className="text-lg text-muted-foreground">{creator.full_name}</p>}

            {creator.biography && (
              <p className="max-w-2xl text-sm text-muted-foreground">{creator.biography}</p>
            )}

            <a
              href={creator.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              <IconExternalLink className="h-3 w-3" />
              View Profile
            </a>
          </div>

          <div className="flex gap-2">
            <Badge variant={creator.tracking_enabled ? 'default' : 'secondary'}>
              {creator.tracking_enabled ? 'Tracking Enabled' : 'Tracking Disabled'}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Followers</CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{creator.followers?.toLocaleString() || '—'}</div>
              <p className="text-xs text-muted-foreground">
                +{creator.followers_since_1st_of_month?.toLocaleString() || 0} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Views</CardTitle>
              <IconEye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{creator.avg_views?.toLocaleString() || '—'}</div>
              <p className="text-xs text-muted-foreground">Per post average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {creator.avg_engagement_rate ? `${creator.avg_engagement_rate.toFixed(2)}%` : '—'}
              </div>
              <p className="text-xs text-muted-foreground">Average across all posts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <IconFiles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{creator.total_media_count?.toLocaleString() || '—'}</div>
              <p className="text-xs text-muted-foreground">{creator.video_count || 0} videos</p>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Aggregated statistics and engagement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-xl font-bold">{creator.total_views?.toLocaleString() || '—'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Likes</p>
                  <p className="text-xl font-bold">{creator.total_likes?.toLocaleString() || '—'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Views (30d)</p>
                  <p className="text-xl font-bold">{creator.views_last_30d?.toLocaleString() || '—'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Views (90d)</p>
                  <p className="text-xl font-bold">{creator.views_last_90d?.toLocaleString() || '—'}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">Content Breakdown</p>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-2xl font-bold">{creator.video_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Videos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{creator.photo_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Photos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{creator.carousel_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Carousels</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Finance Information */}
          <Card>
            <CardHeader>
              <CardTitle>Finance & Payments</CardTitle>
              <CardDescription>Payment tracking and KPI status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Base Monthly Pay</p>
                  <p className="text-xl font-bold">
                    ${creator.base_monthly_pay?.toLocaleString() || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount Due EOM</p>
                  <p className="text-xl font-bold">
                    ${creator.amount_due_eom?.toLocaleString() || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Posts This Month</p>
                  <p className="text-xl font-bold">{creator.this_month_posting_volume || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expected Posts</p>
                  <p className="text-xl font-bold">{creator.expected_monthly_posting_volume || '—'}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">KPI Status</p>
                <Badge
                  variant={
                    creator.kpi_status === 'Exceeding'
                      ? 'default'
                      : creator.kpi_status === 'On Track'
                      ? 'secondary'
                      : 'destructive'
                  }
                  className="mt-1"
                >
                  {creator.kpi_status || 'Unknown'}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                  <p className="text-base">{creator.payment_method || '—'}</p>
                </div>
                {creator.last_paid_date && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Paid</p>
                    <p className="text-base">
                      {new Date(creator.last_paid_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Latest content from this creator</CardDescription>
          </CardHeader>
          <CardContent>
            {creatorPosts.length > 0 ? (
              <div className="space-y-3">
                {creatorPosts.slice(0, 5).map((post) => (
                  <div
                    key={post._id.toString()}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={post.is_trial ? 'secondary' : 'default'}>
                          {post.is_trial ? 'Trial' : 'Published'}
                        </Badge>
                        {post.category && <Badge variant="outline">{post.category}</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {post.views?.toLocaleString()} views • {post.likes?.toLocaleString()} likes
                      </p>
                    </div>
                    <Link href={`/master/posts/${post._id.toString()}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">No posts found</p>
            )}
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="flex justify-start">
          <Link href="/master/creators">
            <Button variant="ghost">← Back to Creators</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
