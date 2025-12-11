# RBAC

- Roles: OWNER > ADMIN > USER > VIEW_ONLY.
- Permissions mapped per workspace type in `lib/rbac.ts`.
- Helpers:
  - `hasRole(current, required)`
  - `hasPermission(role, workspaceType, permission)`
- Protected API examples:
  - `app/api/master/clients` (MASTER ADMIN+)
  - `app/api/client/content` (CLIENT members)
  - `app/api/clipper/uploads` (CLIPPER USER+)

### Memberships
- Many-to-many via `workspace_memberships` collection.
- JWT and session include memberships to allow per-request checks.

