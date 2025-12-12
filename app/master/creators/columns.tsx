'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { CreatorDocument } from '@/lib/models/creator';
import {
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandYoutube,
  IconCheck,
  IconX,
} from '@tabler/icons-react';

/**
 * Column definitions for Creators table
 * Displays profile, performance metrics, and finance info
 */
export const creatorsColumns: ColumnDef<CreatorDocument>[] = [
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
    accessorKey: 'profile_pic_url',
    header: 'Profile',
    cell: ({ row }) => (
      <Avatar className="h-8 w-8">
        <AvatarImage src={row.original.profile_pic_url} alt={row.original.username} />
        <AvatarFallback>{row.original.username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => (
      <Link
        href={`/master/creators/${row.original._id.toString()}`}
        className="font-medium text-blue-600 hover:underline"
      >
        {row.original.username}
      </Link>
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
          <span>{platform}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'followers',
    header: 'Followers',
    cell: ({ row }) => {
      const followers = row.original.followers;
      return followers ? followers.toLocaleString() : '—';
    },
  },
  {
    accessorKey: 'avg_views',
    header: 'Avg Views',
    cell: ({ row }) => {
      const avgViews = row.original.avg_views;
      return avgViews ? avgViews.toLocaleString() : '—';
    },
  },
  {
    accessorKey: 'avg_engagement_rate',
    header: 'Engagement',
    cell: ({ row }) => {
      const rate = row.original.avg_engagement_rate;
      return rate ? `${rate.toFixed(2)}%` : '—';
    },
  },
  {
    accessorKey: 'views_last_30d',
    header: 'Views (30d)',
    cell: ({ row }) => {
      const views = row.original.views_last_30d;
      return views ? views.toLocaleString() : '—';
    },
  },
  {
    accessorKey: 'tracking_enabled',
    header: 'Tracking',
    cell: ({ row }) => {
      const enabled = row.original.tracking_enabled;
      return enabled ? (
        <Badge variant="default" className="gap-1">
          <IconCheck className="h-3 w-3" />
          Enabled
        </Badge>
      ) : (
        <Badge variant="secondary" className="gap-1">
          <IconX className="h-3 w-3" />
          Disabled
        </Badge>
      );
    },
  },
  {
    accessorKey: 'base_monthly_pay',
    header: 'Monthly Pay',
    cell: ({ row }) => {
      const pay = row.original.base_monthly_pay;
      return pay ? `$${pay.toLocaleString()}` : '—';
    },
  },
  {
    accessorKey: 'this_month_posting_volume',
    header: 'Posts (Month)',
    cell: ({ row }) => row.original.this_month_posting_volume ?? '—',
  },
  {
    accessorKey: 'kpi_status',
    header: 'KPI Status',
    cell: ({ row }) => {
      const status = row.original.kpi_status;
      if (!status) return <span className="text-muted-foreground">—</span>;

      const variant =
        status === 'Exceeding'
          ? 'default'
          : status === 'On Track'
          ? 'secondary'
          : status === 'Below Target'
          ? 'outline'
          : 'destructive';

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/master/creators/${row.original._id.toString()}`}>
        <Button variant="ghost" size="sm">
          View Profile
        </Button>
      </Link>
    ),
  },
];
