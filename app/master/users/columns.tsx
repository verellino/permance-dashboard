'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import type { UserDocument } from '@/lib/models/user';
import type { WorkspaceMembershipDocument } from '@/lib/models/workspace-membership';

type UserWithMemberships = UserDocument & {
  memberships?: WorkspaceMembershipDocument[];
};

export const usersColumns: ColumnDef<UserWithMemberships>[] = [
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
    cell: ({ row }) => row.original.name || <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: 'memberships',
    header: 'Workspaces',
    cell: ({ row }) => {
      const memberships = row.original.memberships || [];
      if (memberships.length === 0) {
        return <span className="text-muted-foreground">No workspaces</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {memberships.slice(0, 3).map((m, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {m.workspaceType} ({m.role})
            </Badge>
          ))}
          {memberships.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{memberships.length - 3}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'emailVerified',
    header: 'Status',
    cell: ({ row }) => {
      const verified = row.original.emailVerified;
      return verified ? (
        <Badge variant="default">Verified</Badge>
      ) : (
        <Badge variant="secondary">Unverified</Badge>
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
        <Link href={`/master/users/${id}`}>
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        </Link>
      );
    },
  },
];

