'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getWorkspaceSettings, saveWorkspaceSettings } from '../api/workspace-settings';
import { dashboardKeys } from '@/features/dashboard/dashboard-query-keys';
import type { SaveWorkspaceSettingsMutationInput } from '@/types/settings';

export const workspaceSettingsKeys = {
  all: ['workspace-settings'] as const,
  detail: (workspaceId: string) => [...workspaceSettingsKeys.all, workspaceId] as const,
};

export const useWorkspaceSettings = (workspaceId: string) =>
  useQuery({
    queryKey: workspaceSettingsKeys.detail(workspaceId),
    queryFn: ({ signal }) => getWorkspaceSettings(workspaceId, signal),
    enabled: Boolean(workspaceId),
    staleTime: 30_000,
  });
export const useSaveWorkspaceSettings = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, input }: SaveWorkspaceSettingsMutationInput) =>
      saveWorkspaceSettings(workspaceId, input),
    onSuccess: async (data, variables) => {
      client.setQueryData(workspaceSettingsKeys.detail(variables.workspaceId), data);
      await Promise.all([
        client.invalidateQueries({ queryKey: workspaceSettingsKeys.detail(variables.workspaceId) }),
        client.invalidateQueries({ queryKey: dashboardKeys.summary(variables.workspaceId) }),
      ]);
    },
  });
};
