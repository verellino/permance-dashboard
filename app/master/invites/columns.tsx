'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { InviteDocument } from '@/lib/models/invite';

export const invitesColumns: ColumnDef<InviteDocument>[] = [
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
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.role}</Badge>
    ),
  },
  {
    accessorKey: 'workspaceId',
    header: 'Workspace',
    cell: ({ row }) => {
      const workspaceId = row.original.workspaceId;
      const id = typeof workspaceId === 'string' ? workspaceId : workspaceId.toString();
      return (
        <code className="text-xs bg-muted px-2 py-1 rounded">
          {id.slice(0, 8)}...
        </code>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const invite = row.original;
      const now = new Date();
      
      if (invite.usedAt || invite.acceptedAt) {
        return <Badge variant="default">Accepted</Badge>;
      }
      
      const expiresAt = invite.expiresAt instanceof Date 
        ? invite.expiresAt 
        : new Date(invite.expiresAt);
      
      if (expiresAt.getTime() < now.getTime()) {
        return <Badge variant="destructive">Expired</Badge>;
      }
      
      return <Badge variant="secondary">Pending</Badge>;
    },
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expires',
    cell: ({ row }) => {
      const date = row.original.expiresAt;
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
];

