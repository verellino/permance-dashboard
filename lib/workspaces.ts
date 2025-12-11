import { ObjectId } from 'mongodb';
import { cachedWorkspaceBySubdomain, invalidateWorkspaceCache } from '@/lib/cache/workspaces';
import { createWorkspace, getWorkspaceBySubdomain, type WorkspaceType } from '@/lib/models/workspace';

export async function resolveWorkspace(subdomain: string) {
  const workspace = await cachedWorkspaceBySubdomain(subdomain);
  return workspace;
}

export async function createWorkspaceWithCache(input: {
  name: string;
  subdomain: string;
  type: WorkspaceType;
  settings?: Record<string, unknown>;
}) {
  const ws = await createWorkspace(input);
  invalidateWorkspaceCache(input.subdomain);
  return ws;
}

export async function ensureWorkspace(subdomain: string) {
  const existing = await getWorkspaceBySubdomain(subdomain);
  if (existing) return existing;
  return null;
}

