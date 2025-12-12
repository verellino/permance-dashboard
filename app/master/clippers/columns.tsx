'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import type { WorkspaceDocument } from '@/lib/models/workspace';

type ClipperWithCounts = WorkspaceDocument & {
  memberCount?: number;
};

export const clippersColumns: ColumnDef<ClipperWithCounts>[] = [
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
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: 'subdomain',
    header: 'Subdomain',
    cell: ({ row }) => (
      <code className="text-xs bg-muted px-2 py-1 rounded">{row.original.subdomain}</code>
    ),
  },
  {
    accessorKey: 'parentWorkspaceId',
    header: 'Assigned Client',
    cell: ({ row }) => {
      const parentId = row.original.parentWorkspaceId;
      if (!parentId) {
        return <span className="text-muted-foreground">—</span>;
      }
      const id = typeof parentId === 'string' ? parentId : parentId.toString();
      return (
        <Link href={`/master/clients/${id}`}>
          <Button variant="link" className="h-auto p-0">
            View Client
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: 'memberCount',
    header: 'Members',
    cell: ({ row }) => row.original.memberCount || 0,
  },
  {
    accessorKey: 'deletedAt',
    header: 'Status',
    cell: ({ row }) => {
      const deleted = row.original.deletedAt;
      return deleted ? (
        <Badge variant="destructive">Deleted</Badge>
      ) : (
        <Badge variant="default">Active</Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.original.createdAt;
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
    cell: ({ row }) => {
      const id = typeof row.original._id === 'string' ? row.original._id : row.original._id.toString();
      return (
        <Link href={`/master/clippers/${id}`}>
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        </Link>
      );
    },
  },
];

