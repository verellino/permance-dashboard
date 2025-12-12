'use client';

import { UsersTable } from './users-table';
import { useUsers } from './queries';
import { Skeleton } from '@/components/ui/skeleton';

function UsersTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default function Page() {
  const { data: users, isLoading } = useUsers({ limit: 100 });

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Users & Roles</h1>
        <p className="text-muted-foreground">Manage agency users and roles.</p>
      </div>
      {isLoading ? (
        <UsersTableSkeleton />
      ) : (
        <UsersTable initialData={users || []} />
      )}
    </>
  );
}

