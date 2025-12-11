# Deployment Runbook

1) Set env vars: MongoDB URI/DB, NextAuth secret/url, Google OAuth, SMTP, rate-limit values.
2) Ensure Mongo indexes: created automatically in `lib/mongodb.ts` on first connection.
3) Run migrations if moving from Redis: `pnpm ts-node scripts/migrate-subdomains.ts`.
4) Deploy; verify health by hitting `/api/auth/session` and a subdomain route.
5) Rollback plan: `pnpm ts-node scripts/rollback-subdomains.ts`, revert deploy.
6) Post-deploy checks: sign-in flow, invite acceptance, password reset.

