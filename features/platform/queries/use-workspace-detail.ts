import { queryOptions, useQuery } from '@tanstack/react-query';
import { getPlatformWorkspaceDetail } from '../api/workspaces';
import { platformWorkspaceQueryKeys } from '../workspace-query-keys';

export function platformWorkspaceDetailQueryOptions(workspaceId: string) {
  return queryOptions({
    queryKey: platformWorkspaceQueryKeys.detail(workspaceId),
    queryFn: ({ signal }) => getPlatformWorkspaceDetail(workspaceId, signal),
    enabled: Boolean(workspaceId),
  });
}

export function usePlatformWorkspaceDetail(workspaceId: string) {
  return useQuery(platformWorkspaceDetailQueryOptions(workspaceId));
}
