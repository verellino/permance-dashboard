# PHASE 1

## What’s built
- Multi-tenant routing and auth: Google + credentials via NextAuth v5 with MongoDB adapter; sessions include memberships (workspaceId, type, role, subdomain). Middleware enforces workspace type routing and redirects unauthenticated users to `/login`; master/client/clipper layouts guard access by role.
- Workspace types: MASTER (root), CLIENT (subdomains), CLIPPER (subdomains) with per-type dashboards and sidebars. Workspace switcher (TeamSwitcher) to jump between memberships.
- Sidebar + pages: Master/Client/Clipper sidebars per Phase 2 spec, with placeholder pages for all listed sections. Master content page renders the CSV mock data in a draggable DataTable.
- Invites & onboarding: Invite actions, accept-invite flow, password reset, email verification, and login pages. RBAC helpers in place.
- Data models: MongoDB models for users, workspaces, memberships, invites, audit logs. Subdomains stored in Mongo; Redis migration scripts exist.
- Docs present under `docs/`: `AUTHENTICATION.md`, `WORKSPACES.md`, `RBAC.md`, `INVITES.md`, `ONBOARDING.md`, `EMAIL.md`, `SECURITY.md`, `OBSERVABILITY.md`, `DEPLOYMENT_RUNBOOK.md`, `E2E_STRATEGY.md`.

## Authentication (doc: `docs/AUTHENTICATION.md`)
- NextAuth v5 (MongoDB adapter), providers: Google OAuth + credentials.
- Sessions: JWT, maxAge 30d; session payload includes memberships array.
- Passwords: bcrypt; password reset flow via `/reset-password` and `/reset-password/[token]`.
- Email verification via `/verify-email/[token]`.
- Pages: `/login`, `/reset-password`, `/accept-invite/[token]`, `/verify-email/[token]`.

## Database schema (core collections)
- `users`: `{ _id, email, name?, emailVerified?, password?, createdAt, updatedAt }`
- `workspaces`: `{ _id, name, subdomain, type: "MASTER"|"CLIENT"|"CLIPPER", settings?, parentWorkspaceId?, createdAt, updatedAt, deletedAt? }`
- `workspace_memberships`: `{ _id, userId, workspaceId, role: "OWNER"|"ADMIN"|"USER"|"VIEW_ONLY", workspaceType, invitedBy?, joinedAt, updatedAt }`
- `invites`: `{ _id, tokenHash, email, workspaceId, role, invitedBy, expiresAt, acceptedAt?, usedAt?, createdAt }`
- `audit_logs`: `{ _id, userId?, workspaceId?, action, resourceType?, resourceId?, metadata?, ipAddress?, userAgent?, createdAt }`
- NextAuth tables via adapter: `accounts`, `sessions`, `verification_tokens` (TTL on `expires`), etc.

## How to add clients (manually, today)
1) Create a CLIENT workspace (ensure unique subdomain):
```js
db.workspaces.insertOne({
  name: "Client Name",
  subdomain: "client-subdomain",
  type: "CLIENT",
  settings: {},
  parentWorkspaceId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});
```
2) Add memberships for users who should access it:
```js
db.workspace_memberships.insertOne({
  userId: ObjectId("<user_id>"),
  workspaceId: ObjectId("<workspace_id_from_step1>"),
  role: "ADMIN", // or OWNER/USER/VIEW_ONLY
  workspaceType: "CLIENT",
  invitedBy: null,
  joinedAt: new Date(),
  updatedAt: new Date(),
});
```
3) Sign out/in so the JWT picks up the new membership. Access via `http://client-subdomain.localhost:3000/client/dashboard` (or your root domain).
4) Optionally use the invite flow: create an invite for the client workspace (role ADMIN/USER/etc.), send token, user accepts at `/accept-invite/[token]`.

## How to add master users
- Add a MASTER workspace (if not exists) and membership with role ADMIN or OWNER:
```js
// workspace
db.workspaces.insertOne({
  name: "Master Workspace",
  subdomain: "master",
  type: "MASTER",
  settings: {},
  parentWorkspaceId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});
// membership
db.workspace_memberships.insertOne({
  userId: ObjectId("<user_id>"),
  workspaceId: ObjectId("<master_workspace_id>"),
  role: "OWNER", // or ADMIN
  workspaceType: "MASTER",
  invitedBy: null,
  joinedAt: new Date(),
  updatedAt: new Date(),
});
```

## Navigation & active state
- Sidebar highlights current route based on pathname (`NavMain`).
- Workspace switcher (TeamSwitcher) lists memberships with subdomain-aware links.

If you want a scripted CLI/seeder for creating workspaces and memberships (master/client/clipper) instead of manual Mongo inserts, I can add one next.