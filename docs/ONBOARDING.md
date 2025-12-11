# Onboarding Flow

1) Admin generates invite via server action (UI pending) with workspaceId + role.
2) Invite email sent with token link `/accept-invite/[token]`.
3) Invite page validates token and collects name/password (or use Google sign-in separately).
4) On submit, user is created (if needed), membership is created, invite marked used.
5) User signs in via `/login` (credentials) or Google OAuth.

Environment needed: MongoDB, SMTP, NextAuth secrets, Google OAuth.
