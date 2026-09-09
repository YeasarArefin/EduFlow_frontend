import { apiRequest } from '@/lib/api/client';
export type WorkspaceSettings = {
  workspaceId: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  defaultFeeDueDay: number | null;
  gracePeriodDays: number;
  receiptPrefix: string | null;
  smsDefaultSenderId: string | null;
  absenceEmailEnabled: boolean;
  absenceEmailRecipient: 'guardian' | 'student' | 'both';
  paymentConfirmationEnabled: boolean;
  paymentReminderEnabled: boolean;
  graceReminderEnabled: boolean;
  overdueWarningEnabled: boolean;
};
export type UpdateWorkspaceSettingsInput = Partial<Omit<WorkspaceSettings, 'workspaceId'>>;
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
