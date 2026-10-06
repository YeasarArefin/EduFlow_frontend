export const noticeKeys = {
  all: ['notices'] as const,
  lists: () => [...noticeKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...noticeKeys.lists(), workspaceId] as const,
  detail: (workspaceId: string, id: string) =>
    [...noticeKeys.all, 'detail', workspaceId, id] as const,
  recipients: (workspaceId: string, id: string, status: 'failed' | 'skipped') =>
    [...noticeKeys.detail(workspaceId, id), 'recipients', status] as const,
};
