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
} from '@tabler/icons-react';

/**
 * Column definitions for Posts table
 * Displays both backend-managed (read-only) and frontend-managed fields
 */
export const postsColumns: ColumnDef<PostDocument>[] = [
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
    accessorKey: 'likes',
    header: 'Likes',
    cell: ({ row }) => {
      const likes = row.original.likes;
      return likes ? likes.toLocaleString() : '—';
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
    accessorKey: 'subcategory',
    header: 'Subcategories',
    cell: ({ row }) => {
      const subcategories = row.original.subcategory;
      if (!subcategories || subcategories.length === 0) {
        return <span className="text-muted-foreground">—</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {subcategories.slice(0, 2).map((sub, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {sub}
            </Badge>
          ))}
          {subcategories.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{subcategories.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'reel_style',
    header: 'Reel Style',
    cell: ({ row }) => row.original.reel_style || '—',
  },
  {
    accessorKey: 'is_trial',
    header: 'Type',
    cell: ({ row }) => {
      const isTrial = row.original.is_trial;
      return (
        <Badge variant={isTrial ? 'secondary' : 'default'}>
          {isTrial ? 'Trial' : 'Published'}
        </Badge>
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
    accessorKey: 'post_date',
    header: 'Post Date',
    cell: ({ row }) => {
      const date = row.original.post_date;
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
    accessorKey: 'last_updated',
    header: 'Last Updated',
    cell: ({ row }) => {
      const date = row.original.last_updated;
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
    cell: ({ row }) => (
      <Link href={`/master/posts/${row.original._id.toString()}`}>
        <Button variant="ghost" size="sm">
          View Details
        </Button>
      </Link>
    ),
  },
];
