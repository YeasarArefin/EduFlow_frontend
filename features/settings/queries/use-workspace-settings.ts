'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getWorkspaceSettings, saveWorkspaceSettings } from '../api/workspace-settings';
import type { SaveWorkspaceSettingsMutationInput } from '@/types/settings';
const key = (id: string) => ['workspace-settings', id] as const;
export const useWorkspaceSettings = (workspaceId: string) =>
  useQuery({
    queryKey: key(workspaceId),
    queryFn: ({ signal }) => getWorkspaceSettings(workspaceId, signal),
    enabled: Boolean(workspaceId),
    staleTime: 30_000,
  });
export const useSaveWorkspaceSettings = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, input }: SaveWorkspaceSettingsMutationInput) =>
      saveWorkspaceSettings(workspaceId, input),
    onSuccess: (_, v) => client.invalidateQueries({ queryKey: key(v.workspaceId) }),
  });
};
