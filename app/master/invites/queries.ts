import { useQuery } from '@tanstack/react-query';

export function useInvites(options?: {
  limit?: number;
  skip?: number;
  workspaceId?: string;
  status?: 'pending' | 'accepted' | 'expired';
  role?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['invites', options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.limit) params.set('limit', options.limit.toString());
      if (options?.skip) params.set('skip', options.skip.toString());
      if (options?.workspaceId) params.set('workspaceId', options.workspaceId);
      if (options?.status) params.set('status', options.status);
      if (options?.role) params.set('role', options.role);
      if (options?.search) params.set('search', options.search);
      
      const res = await fetch(`/api/master/invites?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch invites');
      const data = await res.json();
      return data.data;
    }
  });
}

