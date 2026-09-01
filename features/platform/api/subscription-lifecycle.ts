import { apiRequest } from "@/lib/api/client";

export const PLATFORM_SUBSCRIPTION_LIFECYCLE_OPERATIONS = [
  "renewal-due",
  "expire",
  "lock",
  "unlock",
  "schedule-deletion",
] as const;

export type PlatformSubscriptionLifecycleOperation =
  (typeof PLATFORM_SUBSCRIPTION_LIFECYCLE_OPERATIONS)[number];

export type SubscriptionLifecycleOperationResult = {
  workspace: unknown;
  subscription: unknown;
};

export function runPlatformSubscriptionLifecycleOperation(
  workspaceId: string,
  operation: PlatformSubscriptionLifecycleOperation,
  scheduledDeleteAt?: string,
) {
  return apiRequest<SubscriptionLifecycleOperationResult>(
    `/workspaces/${workspaceId}/subscription-operations/${operation}`,
    {
      method: "POST",
      body:
        operation === "schedule-deletion"
          ? { scheduledDeleteAt }
          : undefined,
    },
  );
}
