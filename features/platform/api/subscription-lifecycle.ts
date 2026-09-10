import { apiRequest } from '@/lib/api/client';
import {
  type PlatformSubscriptionLifecycleOperation,
  type SubscriptionLifecycleOperationResult,
} from '@/types/platform';
export {
  PLATFORM_SUBSCRIPTION_LIFECYCLE_OPERATIONS,
  type PlatformSubscriptionLifecycleOperation,
  type SubscriptionLifecycleOperationResult,
} from '@/types/platform';

export function runPlatformSubscriptionLifecycleOperation(
  workspaceId: string,
  operation: PlatformSubscriptionLifecycleOperation,
  scheduledDeleteAt?: string
) {
  return apiRequest<SubscriptionLifecycleOperationResult>(
    `/workspaces/${workspaceId}/subscription-operations/${operation}`,
    {
      method: 'POST',
      body: operation === 'schedule-deletion' ? { scheduledDeleteAt } : undefined,
    }
  );
}
