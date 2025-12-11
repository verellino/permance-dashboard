# Email Service

- Required SMTP env: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`.
- Transport via Nodemailer (`lib/email.ts`).
- Templates: plain text + HTML minimal.
- Used for:
  - Invites
  - Password reset
  - Email verification
- Add provider-specific allowlists for local/staging redirect URLs.

