'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNotice, processNotice, queueNotice, retryNotice } from '../api/notices';
import { noticeKeys } from '../notice-query-keys';
const refresh = (client: ReturnType<typeof useQueryClient>, workspaceId: string, id?: string) =>
  Promise.all([
    client.invalidateQueries({ queryKey: noticeKeys.list(workspaceId) }),
    ...(id ? [client.invalidateQueries({ queryKey: noticeKeys.detail(workspaceId, id) })] : []),
  ]);
export const useCreateNotice = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      workspaceId,
      input,
    }: {
      workspaceId: string;
      input: Parameters<typeof createNotice>[1];
    }) => createNotice(workspaceId, input),
    onSuccess: (_, v) => refresh(client, v.workspaceId),
  });
};
export const useQueueNotice = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, id }: { workspaceId: string; id: string }) =>
      queueNotice(workspaceId, id),
    onSuccess: (_, v) => refresh(client, v.workspaceId, v.id),
  });
};
export const useProcessNotice = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, id }: { workspaceId: string; id: string }) =>
      processNotice(workspaceId, id),
    onSuccess: (_, v) => refresh(client, v.workspaceId, v.id),
  });
};
export const useRetryNotice = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, id }: { workspaceId: string; id: string }) =>
      retryNotice(workspaceId, id),
    onSuccess: (_, v) => refresh(client, v.workspaceId, v.id),
  });
};
