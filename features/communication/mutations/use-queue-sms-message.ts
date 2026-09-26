'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queueSmsMessage } from '../api/sms';
import { communicationKeys } from '../communication-query-keys';
import type { QueueSmsMessageInput } from '@/types/communication';

export function useQueueSmsMessage(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: QueueSmsMessageInput) => queueSmsMessage(workspaceId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: communicationKeys.wallet(workspaceId) });
    },
  });
}
