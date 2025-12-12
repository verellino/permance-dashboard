'use client';

import { DataTable } from '@/components/data-table';
import { invitesColumns } from './columns';
import type { InviteDocument } from '@/lib/models/invite';

interface InvitesTableProps {
  initialData: InviteDocument[];
}

export function InvitesTable({ initialData }: InvitesTableProps) {
  return (
    <DataTable
      data={initialData}
      columns={invitesColumns}
      getRowId={(row) => typeof row._id === 'string' ? row._id : row._id.toString()}
    />
  );
}

