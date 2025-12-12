export default function Page() {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <p className="text-muted-foreground">Review requests, approvals, and assignments.</p>
      </div>
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Tasks list (placeholder)
      </div>
    </>
  );
}

