import crypto from 'crypto';
import { getDb } from '@/lib/mongodb';

type TokenType = 'verify' | 'reset';

const COLLECTION = 'verification_tokens';

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

export async function createToken(
  identifier: string,
  type: TokenType,
  expiresAt: Date
) {
  const token = generateToken(24);
  const tokenHash = hashToken(token);
  const db = await getDb();
  await db.collection(COLLECTION).insertOne({
    identifier,
    tokenHash,
    type,
    expires: expiresAt
  });
  return token;
}

export async function consumeToken(token: string, type: TokenType) {
  const tokenHash = hashToken(token);
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({
    tokenHash,
    type,
    expires: { $gt: new Date() }
  });
  if (!doc) return null;
  await db.collection(COLLECTION).deleteOne({ tokenHash, type });
  return doc.identifier as string;
}

