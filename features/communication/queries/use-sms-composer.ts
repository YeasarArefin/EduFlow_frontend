'use client';
import { useQuery } from '@tanstack/react-query';
import { getSmsWallet, previewSms } from '../api/sms';
import { communicationKeys } from '../communication-query-keys';

export function useSmsWallet(workspaceId: string) {
  return useQuery({
    queryKey: communicationKeys.wallet(workspaceId),
    queryFn: ({ signal }) => getSmsWallet(workspaceId, signal),
    enabled: Boolean(workspaceId),
    staleTime: 15_000,
  });
}
export function useSmsPreview(workspaceId: string, message: string, recipientCount: number) {
  return useQuery({
    queryKey: communicationKeys.preview(workspaceId, message, recipientCount),
    queryFn: ({ signal }) => previewSms(workspaceId, message, recipientCount, signal),
    enabled: Boolean(workspaceId && message.trim() && recipientCount > 0),
    staleTime: 5_000,
  });
}
