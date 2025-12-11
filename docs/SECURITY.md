# Security Notes

- Workspace isolation enforced via middleware headers + per-route membership checks.
- RBAC with role hierarchy; permissions in `lib/rbac.ts`.
- Rate limiting: token bucket (`lib/rate-limit.ts`) applied to auth-sensitive routes; expand as needed.
- Audit logging: `lib/models/audit-log.ts` logs logins and can be extended for invites, role changes, resets.
- Tokens:
  - Invites: SHA-256 hashed, single-use, 7-day TTL.
  - Verification/reset tokens: hashed with SHA-256, TTL index on `expires`.
- Passwords: bcrypt (10 rounds).
- Sessions: JWT + Mongo sessions with TTL index on `expires`.
- Subdomain validation: sanitize to lowercase alphanumerics + hyphens.
