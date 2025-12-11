"use client";

import { DataTable } from '@/components/data-table';
import { masterContentColumns } from './columns';
import { masterContentData } from './data';

export function ContentTable() {
  return (
    <DataTable
      data={masterContentData}
      columns={masterContentColumns}
      getRowId={(_, index) => index?.toString() ?? Math.random().toString()}
    />
  );
}

