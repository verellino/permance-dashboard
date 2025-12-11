# E2E Strategy

- Tooling: Playwright (recommended) or Cypress.
- Core flows to cover:
  - Subdomain routing renders correct workspace type banner.
  - Login (Google mocked or credentials).
  - Invite acceptance: receive token, set password, login.
  - Password reset: request + confirm.
  - RBAC: unauthorized users redirected from /master, /client, /clipper.
  - Protected API routes return 401/403 appropriately.
- Test data: seed workspaces and memberships in Mongo test DB.
- CI: run headless; provide env vars for Mongo + NextAuth secret.

