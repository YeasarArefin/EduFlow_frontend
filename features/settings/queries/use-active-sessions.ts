'use client';

import { useQuery } from '@tanstack/react-query';
import { getActiveSessions } from '../api/sessions';

export const sessionKeys = { all: ['active-sessions'] as const };

export function useActiveSessions() {
  return useQuery({
    queryKey: sessionKeys.all,
    queryFn: ({ signal }) => getActiveSessions(signal),
    staleTime: 30_000,
  });
}
