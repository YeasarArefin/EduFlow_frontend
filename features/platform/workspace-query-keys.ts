import type { PlatformWorkspaceListParams } from './api/workspaces';

export const platformWorkspaceQueryKeys = {
  all: ['platform', 'workspaces'] as const,
  list: (params: PlatformWorkspaceListParams) =>
    [...platformWorkspaceQueryKeys.all, 'list', params] as const,
  detail: (workspaceId: string) =>
    [...platformWorkspaceQueryKeys.all, 'detail', workspaceId] as const,
};
