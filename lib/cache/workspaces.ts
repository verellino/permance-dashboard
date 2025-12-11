import { LRUCache } from 'lru-cache';
import {
  getWorkspaceBySubdomain,
  type WorkspaceDocument
} from '@/lib/models/workspace';

const cache = new LRUCache<
  string,
  WorkspaceDocument | false
>({
  max: 500,
  ttl: 1000 * 60 * 10, // 10 minutes
  allowStale: true
});

export async function cachedWorkspaceBySubdomain(subdomain: string) {
  const key = subdomain.toLowerCase();
  const cached = cache.get(key);
  if (cached !== undefined) return cached === false ? null : cached;
  const ws = await getWorkspaceBySubdomain(key);
  cache.set(key, ws || false);
  return ws;
}

export function invalidateWorkspaceCache(subdomain: string) {
  cache.delete(subdomain.toLowerCase());
}

