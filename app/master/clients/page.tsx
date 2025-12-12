'use client';

import { ClientsTable } from './clients-table';
import { useClients } from './queries';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

function ClientsTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-40 w-full mt-4" />
    </div>
  );
}

export default function Page() {
  const { data: clients, isLoading } = useClients({ limit: 100 });

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <p className="text-muted-foreground">Manage client workspaces and view their status.</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Link href="/master/clients/new">
            <Button>Create Client</Button>
          </Link>
        </div>
        {isLoading ? (
          <ClientsTableSkeleton />
        ) : (
          <ClientsTable initialData={clients || []} />
        )}
      </div>
    </>
  );
}

