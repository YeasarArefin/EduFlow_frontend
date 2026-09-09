import type { FeeListParams } from './api/fees';

export const feeKeys = {
  all: ['fees'] as const,
  lists: () => [...feeKeys.all, 'list'] as const,
  list: (workspaceId: string, params: FeeListParams) =>
    [...feeKeys.lists(), workspaceId, params] as const,
  payments: (workspaceId: string, feeId: string) =>
    [...feeKeys.all, 'payments', workspaceId, feeId] as const,
  studentFees: (workspaceId: string, studentId: string, params?: Record<string, unknown>) =>
    [...feeKeys.all, 'student', workspaceId, studentId, params] as const,
  receipt: (workspaceId: string, receiptNumber: string) =>
    [...feeKeys.all, 'receipt', workspaceId, receiptNumber] as const,
  paymentDetail: (workspaceId: string, paymentId: string) =>
    [...feeKeys.all, 'paymentDetail', workspaceId, paymentId] as const,
};
