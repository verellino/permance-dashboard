'use client';

import { ClippersTable } from './clippers-table';
import { useClippers } from './queries';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

function ClippersTableSkeleton() {
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
  const { data: clippers, isLoading } = useClippers({ limit: 100 });

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Clippers</h1>
        <p className="text-muted-foreground">Manage clipper workspaces and accounts.</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Link href="/master/clippers/new">
            <Button>Create Clipper</Button>
          </Link>
        </div>
        {isLoading ? (
          <ClippersTableSkeleton />
        ) : (
          <ClippersTable initialData={clippers || []} />
        )}
      </div>
    </>
  );
}
