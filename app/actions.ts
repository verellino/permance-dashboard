'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { protocol, rootDomain } from '@/lib/utils';
import { isValidIcon } from '@/lib/subdomains';
import {
  createWorkspaceWithCache,
  ensureWorkspace
} from '@/lib/workspaces';
import { softDeleteWorkspace } from '@/lib/models/workspace';
import { ObjectId } from 'mongodb';

export async function createSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain') as string;
  const icon = formData.get('icon') as string;

  if (!subdomain || !icon) {
    return { success: false, error: 'Subdomain and icon are required' };
  }

  if (!isValidIcon(icon)) {
    return {
      subdomain,
      icon,
      success: false,
      error: 'Please enter a valid emoji (maximum 10 characters)'
    };
  }

  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

  if (sanitizedSubdomain !== subdomain) {
    return {
      subdomain,
      icon,
      success: false,
      error:
        'Subdomain can only have lowercase letters, numbers, and hyphens. Please try again.'
    };
  }

  const existing = await ensureWorkspace(sanitizedSubdomain);
  if (existing) {
    return {
      subdomain,
      icon,
      success: false,
      error: 'This subdomain is already taken'
    };
  }

  await createWorkspaceWithCache({
    name: sanitizedSubdomain,
    subdomain: sanitizedSubdomain,
    type: 'CLIENT',
    settings: { emoji: icon }
  });

  redirect(`${protocol}://${sanitizedSubdomain}.${rootDomain}`);
}

export async function deleteSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain');
  if (typeof subdomain !== 'string') {
    return { success: false, error: 'Invalid subdomain' };
  }
  const existing = await ensureWorkspace(subdomain);
  if (existing?._id) {
    await softDeleteWorkspace(new ObjectId(existing._id));
  }
  revalidatePath('/admin');
  return { success: 'Domain deleted successfully' };
}
