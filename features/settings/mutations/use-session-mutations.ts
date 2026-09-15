'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { revokeOtherSessions, revokeSession } from '../api/sessions';
import { sessionKeys } from '../queries/use-active-sessions';

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: revokeSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionKeys.all }),
  });
}

export function useRevokeOtherSessions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: revokeOtherSessions,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionKeys.all }),
  });
}
