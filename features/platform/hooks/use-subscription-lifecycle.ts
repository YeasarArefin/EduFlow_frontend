'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import {
  runPlatformSubscriptionLifecycleOperation,
  type PlatformSubscriptionLifecycleOperation,
} from '../api/subscription-lifecycle';
import { platformWorkspaceQueryKeys } from '../workspace-query-keys';

const operationLabels: Record<PlatformSubscriptionLifecycleOperation, string> = {
  'renewal-due': 'Subscription marked as renewal due.',
  expire: 'Subscription expired.',
  lock: 'Workspace locked.',
  unlock: 'Workspace unlocked.',
  'schedule-deletion': 'Workspace deletion scheduled.',
};

export function useRunPlatformSubscriptionLifecycleOperation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      operation,
      scheduledDeleteAt,
    }: {
      workspaceId: string;
      operation: PlatformSubscriptionLifecycleOperation;
      scheduledDeleteAt?: string;
    }) => runPlatformSubscriptionLifecycleOperation(workspaceId, operation, scheduledDeleteAt),
    onSuccess: async (_result, variables) => {
      await queryClient.invalidateQueries({
        queryKey: platformWorkspaceQueryKeys.all,
      });
      toast.success(operationLabels[variables.operation]);
    },
    onError: async (error) => {
      if (error instanceof ApiError && error.status === 409) {
        await queryClient.invalidateQueries({
          queryKey: platformWorkspaceQueryKeys.all,
        });
        toast.error(
          'This lifecycle action is no longer valid. The latest workspace state has been loaded.'
        );
        return;
      }

      toast.error(
        error instanceof Error ? error.message : 'Could not update the subscription lifecycle.'
      );
    },
  });
}
