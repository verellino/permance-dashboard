'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { PostDocument } from '@/lib/models/post';
import {
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandYoutube,
  IconExternalLink,
} from '@tabler/icons-react';
import { TrialActions } from './trial-actions';

/**
 * Column definitions for Trial Reels table
 * Includes approve/reject action buttons
 */
export const trialReelsColumns: ColumnDef<PostDocument>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'url',
    header: 'Link',
    cell: ({ row }) => (
      <a
        href={row.original.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-blue-600 hover:underline"
      >
        <IconExternalLink className="h-3 w-3" />
        <span className="text-xs">View Post</span>
      </a>
    ),
  },
  {
    accessorKey: 'platform',
    header: 'Platform',
    cell: ({ row }) => {
      const platform = row.original.platform;
      if (!platform) return <span className="text-muted-foreground">—</span>;

      const PlatformIcon =
        platform === 'Instagram'
          ? IconBrandInstagram
          : platform === 'TikTok'
          ? IconBrandTiktok
          : IconBrandYoutube;

      return (
        <div className="flex items-center gap-2">
          <PlatformIcon className="h-4 w-4" />
          <span className="font-medium">{platform}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'username',
    header: 'Creator',
    cell: ({ row }) => row.original.username || '—',
  },
  {
    accessorKey: 'views',
    header: 'Views',
    cell: ({ row }) => {
      const views = row.original.views;
      return views ? views.toLocaleString() : '—';
    },
  },
  {
    accessorKey: 'engagement_rate',
    header: 'Engagement',
    cell: ({ row }) => {
      const rate = row.original.engagement_rate;
      return rate ? `${rate.toFixed(2)}%` : '—';
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original.category;
      return category ? (
        <Badge variant="secondary">{category}</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: 'processing_status',
    header: 'AI Status',
    cell: ({ row }) => {
      const status = row.original.processing_status;
      const variant =
        status === 'completed'
          ? 'default'
          : status === 'processing'
          ? 'secondary'
          : status === 'failed'
          ? 'destructive'
          : 'outline';

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'added_date',
    header: 'Added',
    cell: ({ row }) => {
      const date = row.original.added_date;
      return date
        ? new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : '—';
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link href={`/master/posts/${row.original._id.toString()}`}>
          <Button variant="outline" size="sm">
            View
          </Button>
        </Link>
        <TrialActions postId={row.original._id.toString()} />
      </div>
    ),
  },
];
