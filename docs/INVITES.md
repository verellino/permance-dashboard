# Invites

- Invites stored in `invites` collection with hashed token, expiry (7 days), single-use.
- Token: base64url(randomBytes(24)), hashed with SHA-256 before storage.
- Creation: `createInviteAction` (server action) sends email via SMTP.
- Acceptance: `/accept-invite/[token]` page posts to `/accept-invite` route.
- On accept:
  - Create user if absent (password optional for OAuth users).
  - Upsert membership with role + workspaceType.
  - Mark invite used.
- TTL index on `expiresAt` handles cleanup; `usedAt` prevents reuse.

