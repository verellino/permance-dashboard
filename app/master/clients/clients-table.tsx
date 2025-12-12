'use client';

import { DataTable } from '@/components/data-table';
import { clientsColumns } from './columns';
import type { WorkspaceDocument } from '@/lib/models/workspace';

type ClientWithCounts = WorkspaceDocument & {
  memberCount?: number;
};

interface ClientsTableProps {
  initialData: ClientWithCounts[];
}

export function ClientsTable({ initialData }: ClientsTableProps) {
  return (
    <DataTable
      data={initialData}
      columns={clientsColumns}
      getRowId={(row) => typeof row._id === 'string' ? row._id : row._id.toString()}
    />
  );
}

