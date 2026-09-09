import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';
import { getPlatformWorkspaces, type PlatformWorkspaceListParams } from '../api/workspaces';
import { platformWorkspaceQueryKeys } from '../workspace-query-keys';

export function platformWorkspacesQueryOptions(params: PlatformWorkspaceListParams) {
  return queryOptions({
    queryKey: platformWorkspaceQueryKeys.list(params),
    queryFn: ({ signal }) => getPlatformWorkspaces(params, signal),
    placeholderData: keepPreviousData,
  });
}

export function usePlatformWorkspaces(params: PlatformWorkspaceListParams) {
  return useQuery(platformWorkspacesQueryOptions(params));
}
