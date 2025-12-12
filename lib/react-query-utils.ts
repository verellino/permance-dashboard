'use client';

import { useQueryClient } from '@tanstack/react-query';

export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  
  return {
    invalidateClients: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
    invalidateClippers: () => queryClient.invalidateQueries({ queryKey: ['clippers'] }),
    invalidateUsers: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    invalidateInvites: () => queryClient.invalidateQueries({ queryKey: ['invites'] }),
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clippers'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['invites'] });
    }
  };
}

