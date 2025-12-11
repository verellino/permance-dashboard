import { redis } from '@/lib/redis';
import { createWorkspace } from '@/lib/models/workspace';
import { getDb } from '@/lib/mongodb';

async function run() {
  const keys = await redis.keys('subdomain:*');
  for (const key of keys) {
    const subdomain = key.replace('subdomain:', '');
    const data = await redis.get<{ emoji?: string; createdAt?: number }>(key);
    await createWorkspace({
      name: subdomain,
      subdomain,
      type: 'CLIENT',
      settings: { emoji: data?.emoji },
      parentWorkspaceId: null
    });
    console.log(`Migrated ${subdomain}`);
  }
  // optional: drop redis keys after verifying
}

run()
  .then(async () => {
    const db = await getDb();
    await db.client?.close?.();
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

