import { useQuery } from '@tanstack/react-query';

export function useClippers(options?: {
  limit?: number;
  skip?: number;
  includeDeleted?: boolean;
  search?: string;
}) {
  return useQuery({
    queryKey: ['clippers', options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.limit) params.set('limit', options.limit.toString());
      if (options?.skip) params.set('skip', options.skip.toString());
      if (options?.includeDeleted) params.set('includeDeleted', 'true');
      if (options?.search) params.set('search', options.search);
      
      const res = await fetch(`/api/master/clippers?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch clippers');
      const data = await res.json();
      return data.data;
    }
  });
}

