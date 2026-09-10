import { apiListRequest, apiRequest } from '@/lib/api/client';

import {
  FEE_STATUSES,
  PAYMENT_METHODS,
  type BulkGenerateResult,
  type FeeListMeta,
  type FeeListParams,
  type FeeStatus,
  type ReceiptDetail,
  type RecordPaymentInput,
  type RecordPaymentResult,
  type StudentFee,
  type StudentPayment,
} from '@/types/fees';

export { FEE_STATUSES, PAYMENT_METHODS };
export type {
  BulkGenerateResult,
  FeeListMeta,
  FeeListParams,
  FeeStatus,
  PaymentMethod,
  ReceiptDetail,
  RecordPaymentInput,
  RecordPaymentResult,
  StudentFee,
  StudentPayment,
} from '@/types/fees';
const headers = (workspaceId: string) => ({ 'X-Workspace-Id': workspaceId });

export function getFees(workspaceId: string, params: FeeListParams, signal?: AbortSignal) {
  const query = new URLSearchParams({
    feeMonth: params.feeMonth,
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
  });
  if (params.status) query.set('status', params.status);
  if (params.search) query.set('search', params.search);

  return apiListRequest<StudentFee[], FeeListMeta>(`/student-fees?${query}`, {
    headers: headers(workspaceId),
    signal,
  });
}

export function getStudentFees(
  workspaceId: string,
  studentId: string,
  params?: { feeMonth?: string; status?: FeeStatus; page?: number; limit?: number },
  signal?: AbortSignal
) {
  const query = new URLSearchParams({
    page: String(params?.page ?? 1),
    limit: String(params?.limit ?? 50),
  });
  if (params?.feeMonth) query.set('feeMonth', params.feeMonth);
  if (params?.status) query.set('status', params.status);

  return apiListRequest<StudentFee[], FeeListMeta>(`/students/${studentId}/fees?${query}`, {
    headers: headers(workspaceId),
    signal,
  });
}

export function getFeePayments(workspaceId: string, feeId: string, signal?: AbortSignal) {
  return apiRequest<StudentPayment[]>(`/student-fees/${feeId}/payments`, {
    headers: headers(workspaceId),
    signal,
  });
}

export function recordFeePayment(workspaceId: string, feeId: string, input: RecordPaymentInput) {
  return apiRequest<RecordPaymentResult>(`/student-fees/${feeId}/payments`, {
    method: 'POST',
    headers: headers(workspaceId),
    body: input,
  });
}

export function getReceiptByNumber(
  workspaceId: string,
  receiptNumber: string,
  signal?: AbortSignal
) {
  return apiRequest<ReceiptDetail>(
    `/student-payments/receipts/${encodeURIComponent(receiptNumber)}`,
    {
      headers: headers(workspaceId),
      signal,
    }
  );
}

export function getPaymentById(workspaceId: string, paymentId: string, signal?: AbortSignal) {
  return apiRequest<ReceiptDetail>(`/student-payments/${paymentId}`, {
    headers: headers(workspaceId),
    signal,
  });
}

export function bulkGenerateFees(workspaceId: string, feeMonth: string) {
  return apiRequest<BulkGenerateResult>('/student-fees/generate', {
    method: 'POST',
    headers: headers(workspaceId),
    body: { feeMonth },
  });
}
