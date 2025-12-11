import { redis } from '@/lib/redis';
import { getDb } from '@/lib/mongodb';

async function run() {
  const db = await getDb();
  const workspaces = await db
    .collection('workspaces')
    .find({ type: 'CLIENT', deletedAt: { $exists: false } })
    .toArray();

  for (const ws of workspaces) {
    const emoji =
      (ws.settings as { emoji?: string } | undefined)?.emoji || '❓';
    await redis.set(`subdomain:${ws.subdomain}`, {
      emoji,
      createdAt: ws.createdAt?.getTime?.() ?? Date.now()
    });
    console.log(`Rolled back ${ws.subdomain}`);
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

