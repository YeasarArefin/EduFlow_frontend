import { apiRequest } from '@/lib/api/client';
import type {
  QueueSmsMessageInput,
  QueuedSmsMessage,
  SmsPreview,
  SmsTemplate,
  SmsTemplateInput,
  SmsWalletSummary,
} from '@/types/communication';

const headers = (workspaceId: string) => ({ 'X-Workspace-Id': workspaceId });
export const previewSms = (
  workspaceId: string,
  message: string,
  recipientCount: number,
  signal?: AbortSignal
) =>
  apiRequest<SmsPreview>('/sms/preview', {
    method: 'POST',
    headers: headers(workspaceId),
    body: { message, recipientCount },
    signal,
  });
export const getSmsWallet = (workspaceId: string, signal?: AbortSignal) =>
  apiRequest<SmsWalletSummary>('/sms-wallet', { headers: headers(workspaceId), signal });
export const queueSmsMessage = (workspaceId: string, input: QueueSmsMessageInput) =>
  apiRequest<QueuedSmsMessage>('/sms/messages', {
    method: 'POST',
    headers: headers(workspaceId),
    body: input,
  });
export const getSmsTemplates = (workspaceId: string, signal?: AbortSignal) =>
  apiRequest<SmsTemplate[]>('/sms/templates', { headers: headers(workspaceId), signal });
export const createSmsTemplate = (workspaceId: string, input: SmsTemplateInput) =>
  apiRequest<SmsTemplate>('/sms/templates', {
    method: 'POST',
    headers: headers(workspaceId),
    body: input,
  });
export const updateSmsTemplate = (
  workspaceId: string,
  id: string,
  input: Partial<SmsTemplateInput>
) =>
  apiRequest<SmsTemplate>(`/sms/templates/${id}`, {
    method: 'PATCH',
    headers: headers(workspaceId),
    body: input,
  });
