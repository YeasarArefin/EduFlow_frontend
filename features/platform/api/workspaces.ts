import { apiListRequest, apiRequest } from '@/lib/api/client';
import type {
  PaginationMeta,
  PlatformWorkspace,
  PlatformWorkspaceDetail,
  PlatformWorkspaceListParams,
} from '@/types/platform';

export {
  PLATFORM_ACCESS_STATUSES,
  PLATFORM_SUBSCRIPTION_STATUSES,
  PLATFORM_WORKSPACE_STATUSES,
  type PaginationMeta,
  type PlatformWorkspace,
  type PlatformWorkspaceDetail,
  type PlatformWorkspaceListParams,
} from '@/types/platform';

export async function getPlatformWorkspaces(
  params: PlatformWorkspaceListParams,
  signal?: AbortSignal
) {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search) searchParams.set('search', params.search);
  if (params.workspaceStatus) searchParams.set('workspaceStatus', params.workspaceStatus);
  if (params.subscriptionStatus) searchParams.set('subscriptionStatus', params.subscriptionStatus);
  if (params.accessStatus) searchParams.set('accessStatus', params.accessStatus);
  if (params.lifecycleQueue) searchParams.set('lifecycleQueue', 'true');

  return apiListRequest<PlatformWorkspace[], PaginationMeta>(`/workspaces?${searchParams}`, {
    signal,
  });
}

export function getPlatformWorkspaceDetail(workspaceId: string, signal?: AbortSignal) {
  return apiRequest<PlatformWorkspaceDetail>(`/workspaces/${workspaceId}`, { signal });
}
