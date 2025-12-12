import { useQuery } from '@tanstack/react-query';

export function useUsers(options?: {
  limit?: number;
  skip?: number;
  workspaceType?: string;
  role?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['users', options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.limit) params.set('limit', options.limit.toString());
      if (options?.skip) params.set('skip', options.skip.toString());
      if (options?.workspaceType) params.set('workspaceType', options.workspaceType);
      if (options?.role) params.set('role', options.role);
      if (options?.search) params.set('search', options.search);
      
      const res = await fetch(`/api/master/users?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      return data.data;
    }
  });
}

