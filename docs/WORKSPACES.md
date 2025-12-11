# Workspaces & Subdomains

- Workspace types: MASTER, CLIENT, CLIPPER.
- Stored in MongoDB `workspaces` collection; unique `subdomain`.
- Middleware resolves `{subdomain}.domain.com` to workspace and injects headers:
  - `x-workspace-id`
  - `x-workspace-type`
- Cached via LRU in `lib/cache/workspaces.ts`.
- Soft delete supported via `deletedAt`.

## Layouts

- `/master/*` guarded for MASTER ADMIN+.
- `/client/*` guarded for CLIENT members.
- `/clipper/*` guarded for CLIPPER USER+.
