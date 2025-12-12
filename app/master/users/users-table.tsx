'use client';

import { DataTable } from '@/components/data-table';
import { usersColumns } from './columns';
import type { UserDocument } from '@/lib/models/user';
import type { WorkspaceMembershipDocument } from '@/lib/models/workspace-membership';

type UserWithMemberships = UserDocument & {
  memberships?: WorkspaceMembershipDocument[];
};

interface UsersTableProps {
  initialData: UserWithMemberships[];
}

export function UsersTable({ initialData }: UsersTableProps) {
  return (
    <DataTable
      data={initialData}
      columns={usersColumns}
      getRowId={(row) => typeof row._id === 'string' ? row._id : row._id.toString()}
    />
  );
}

