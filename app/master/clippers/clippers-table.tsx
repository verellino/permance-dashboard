'use client';

import { DataTable } from '@/components/data-table';
import { clippersColumns } from './columns';
import type { WorkspaceDocument } from '@/lib/models/workspace';

type ClipperWithCounts = WorkspaceDocument & {
  memberCount?: number;
};

interface ClippersTableProps {
  initialData: ClipperWithCounts[];
}

export function ClippersTable({ initialData }: ClippersTableProps) {
  return (
    <DataTable
      data={initialData}
      columns={clippersColumns}
      getRowId={(row) => typeof row._id === 'string' ? row._id : row._id.toString()}
    />
  );
}

