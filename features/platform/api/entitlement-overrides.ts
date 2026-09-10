import { apiRequest } from '@/lib/api/client';
import type {
  WorkspaceEntitlementOverride,
  WorkspaceEntitlementOverrideInput,
} from '@/types/platform';
export type {
  WorkspaceEntitlementOverride,
  WorkspaceEntitlementOverrideInput,
} from '@/types/platform';

export function getWorkspaceEntitlementOverrides(workspaceId: string, signal?: AbortSignal) {
  return apiRequest<WorkspaceEntitlementOverride[]>(
    `/workspaces/${workspaceId}/entitlement-overrides`,
    { signal }
  );
}

export function createWorkspaceEntitlementOverride(
  workspaceId: string,
  input: WorkspaceEntitlementOverrideInput
) {
  return apiRequest<WorkspaceEntitlementOverride>(
    `/workspaces/${workspaceId}/entitlement-overrides`,
    { method: 'POST', body: input }
  );
}

export function updateWorkspaceEntitlementOverride(
  workspaceId: string,
  overrideId: string,
  input: Partial<WorkspaceEntitlementOverrideInput>
) {
  return apiRequest<WorkspaceEntitlementOverride>(
    `/workspaces/${workspaceId}/entitlement-overrides/${overrideId}`,
    { method: 'PATCH', body: input }
  );
}

export function removeWorkspaceEntitlementOverride(workspaceId: string, overrideId: string) {
  return apiRequest<void>(`/workspaces/${workspaceId}/entitlement-overrides/${overrideId}`, {
    method: 'DELETE',
  });
}
