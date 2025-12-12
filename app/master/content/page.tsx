import { ContentTable } from './content-table';

export default function Page() {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Content</h1>
        <p className="text-muted-foreground">All posted content across all clients.</p>
      </div>
      <ContentTable />
    </>
  );
}

