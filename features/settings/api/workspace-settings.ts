import { apiRequest } from '@/lib/api/client';
import type { UpdateWorkspaceSettingsInput, WorkspaceSettings } from '@/types/settings';
export type { UpdateWorkspaceSettingsInput, WorkspaceSettings } from '@/types/settings';
const headers = (workspaceId: string) => ({ 'X-Workspace-Id': workspaceId });
export const getWorkspaceSettings = (workspaceId: string, signal?: AbortSignal) =>
  apiRequest<WorkspaceSettings>('/workspace-settings', {
    headers: headers(workspaceId),
    signal,
  });
export const saveWorkspaceSettings = (workspaceId: string, input: UpdateWorkspaceSettingsInput) =>
  apiRequest<WorkspaceSettings>('/workspace-settings', {
    method: 'PATCH',
    headers: headers(workspaceId),
    body: input,
  });
