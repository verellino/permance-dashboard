import { MongoClient, type Db } from 'mongodb';

const uriEnv = process.env.MONGODB_URI;
const dbNameEnv = process.env.MONGODB_DB_NAME;

if (!uriEnv) {
  throw new Error('MONGODB_URI is not set');
}

if (!dbNameEnv) {
  throw new Error('MONGODB_DB_NAME is not set');
}

const uri = uriEnv as string;
const dbName = dbNameEnv as string;

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;
let initPromise: Promise<void> | null = null;

export async function getMongoClient() {
  if (client) return client;
  if (!clientPromise) {
    clientPromise = MongoClient.connect(uri, {
      maxPoolSize: 10
    }).then((connected) => {
      client = connected;
      return connected;
    });
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const mongoClient = await getMongoClient();
  const db = mongoClient.db(dbName);

  if (!initPromise) {
    initPromise = ensureIndexes(db);
  }
  await initPromise;

  return db;
}

export async function pingMongo() {
  const db = await getDb();
  return db.command({ ping: 1 });
}

async function ensureIndexes(db: Db) {
  await Promise.all([
    db.collection('workspaces').createIndex({ subdomain: 1 }, { unique: true }),
    db
      .collection('workspace_memberships')
      .createIndex({ userId: 1, workspaceId: 1 }, { unique: true }),
    db
      .collection('invites')
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db
      .collection('sessions')
      .createIndex({ expires: 1 }, { expireAfterSeconds: 0 }),
    db
      .collection('verification_tokens')
      .createIndex({ expires: 1 }, { expireAfterSeconds: 0 })
  ]);
}

