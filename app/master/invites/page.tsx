'use client';

import { InvitesTable } from './invites-table';
import { useInvites } from './queries';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

function InvitesTableSkeleton() {
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
  const { data: invites, isLoading } = useInvites({ limit: 100 });

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Invites</h1>
        <p className="text-muted-foreground">Centralized invite management for the agency.</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Link href="/master/invites/new">
            <Button>Create Invite</Button>
          </Link>
        </div>
        {isLoading ? (
          <InvitesTableSkeleton />
        ) : (
          <InvitesTable initialData={invites || []} />
        )}
      </div>
    </>
  );
}

