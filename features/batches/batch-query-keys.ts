import type { BatchListParams } from './api/batches';
export const batchKeys = {
  all: ['batches'] as const,
  lists: () => [...batchKeys.all, 'list'] as const,
  list: (workspaceId: string, params: BatchListParams) =>
    [...batchKeys.lists(), workspaceId, params] as const,
  detail: (workspaceId: string, id: string) =>
    [...batchKeys.all, 'detail', workspaceId, id] as const,
};
