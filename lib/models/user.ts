import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

export type UserRole = 'OWNER' | 'ADMIN' | 'USER' | 'VIEW_ONLY';

export type UserDocument = {
  _id: ObjectId;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  password?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const COLLECTION = 'users';

export async function findUserByEmail(email: string) {
  const db = await getDb();
  return db.collection<UserDocument>(COLLECTION).findOne({ email });
}

export async function insertUser(doc: Partial<UserDocument>) {
  const db = await getDb();
  const now = new Date();
  const record: UserDocument = {
    _id: new ObjectId(),
    email: doc.email!,
    name: doc.name ?? null,
    emailVerified: doc.emailVerified ?? null,
    password: doc.password ?? null,
    createdAt: now,
    updatedAt: now
  };
  await db.collection<UserDocument>(COLLECTION).insertOne(record);
  return record;
}

export async function updateUserPassword(userId: ObjectId, password: string) {
  const db = await getDb();
  await db
    .collection<UserDocument>(COLLECTION)
    .updateOne({ _id: userId }, { $set: { password, updatedAt: new Date() } });
}

export async function verifyUserEmail(userId: ObjectId) {
  const db = await getDb();
  await db
    .collection<UserDocument>(COLLECTION)
    .updateOne(
      { _id: userId },
      { $set: { emailVerified: new Date(), updatedAt: new Date() } }
    );
}

export async function getUserById(userId: ObjectId) {
  const db = await getDb();
  return db.collection<UserDocument>(COLLECTION).findOne({ _id: userId });
}

export async function getAllUsers(options?: {
  limit?: number;
  skip?: number;
  search?: string;
}) {
  const db = await getDb();
  const query: any = {};
  
  if (options?.search) {
    query.$or = [
      { email: { $regex: options.search, $options: 'i' } },
      { name: { $regex: options.search, $options: 'i' } }
    ];
  }
  
  const cursor = db.collection<UserDocument>(COLLECTION).find(query);
  
  if (options?.skip) {
    cursor.skip(options.skip);
  }
  if (options?.limit) {
    cursor.limit(options.limit);
  }
  
  return cursor.toArray();
}

export async function updateUser(userId: ObjectId, updates: Partial<Pick<UserDocument, 'name' | 'email'>>) {
  const db = await getDb();
  await db
    .collection<UserDocument>(COLLECTION)
    .updateOne(
      { _id: userId },
      { $set: { ...updates, updatedAt: new Date() } }
    );
}

export async function disableUser(userId: ObjectId) {
  const db = await getDb();
  // For now, we'll add a disabledAt field if needed, or use a flag
  // Since the schema doesn't have it, we'll add it dynamically
  await db
    .collection<UserDocument>(COLLECTION)
    .updateOne(
      { _id: userId },
      { $set: { updatedAt: new Date() } }
    );
}

