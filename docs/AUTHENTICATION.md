# Authentication

## Key Points

- NextAuth.js v5 with official MongoDB adapter.
- Providers: Google OAuth, Credentials.
- Sessions: JWT, 30-day maxAge; sessions collection has TTL index on `expires`.
- Passwords: bcrypt (10 rounds).
- Email verification: verification tokens stored hashed; consumed via `/api/auth/verify-email` or `/verify-email/[token]`.
- Password reset: request `/api/auth/reset-password`, confirm `/api/auth/reset-password/[token]`.
- Login UI: `/login` with Google + credentials.

### Session shape

- `session.user.id`
- `session.memberships`: array of `{ workspaceId, workspaceType, role }`.

### Environment

- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
