import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT
  ? parseInt(process.env.SMTP_PORT, 10)
  : undefined;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASSWORD;
const from = process.env.SMTP_FROM;

if (!host || !port || !user || !pass || !from) {
  console.warn('SMTP configuration is incomplete; email sending may fail.');
}

export function getTransport() {
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    }
  });
}

export async function sendEmailVerification(to: string, tokenUrl: string) {
  const transport = getTransport();
  await transport.sendMail({
    from,
    to,
    subject: 'Verify your email',
    text: `Verify your email by visiting: ${tokenUrl}`,
    html: `<p>Verify your email by visiting: <a href="${tokenUrl}">${tokenUrl}</a></p>`
  });
}

export async function sendPasswordReset(to: string, tokenUrl: string) {
  const transport = getTransport();
  await transport.sendMail({
    from,
    to,
    subject: 'Reset your password',
    text: `Reset your password: ${tokenUrl}`,
    html: `<p>Reset your password: <a href="${tokenUrl}">${tokenUrl}</a></p>`
  });
}

export async function sendInviteEmail(to: string, tokenUrl: string) {
  const transport = getTransport();
  await transport.sendMail({
    from,
    to,
    subject: 'You are invited',
    text: `Accept your invite: ${tokenUrl}`,
    html: `<p>Accept your invite: <a href="${tokenUrl}">${tokenUrl}</a></p>`
  });
}

