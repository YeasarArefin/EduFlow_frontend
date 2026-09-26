import { apiRequest } from '@/lib/api/client';
import type { PlatformPayment } from '@/types/platform';
export type { PlatformPayment } from '@/types/platform';

export function getPendingPlatformPayments(search?: string, signal?: AbortSignal) {
  const query = search ? `?${new URLSearchParams({ search })}` : '';
  return apiRequest<PlatformPayment[]>(`/payment-requests/pending${query}`, { signal });
}

export function approvePlatformPayment(paymentId: string) {
  return apiRequest<PlatformPayment>(`/payment-requests/${paymentId}/approve`, { method: 'POST' });
}

export function rejectPlatformPayment(paymentId: string, rejectionReason: string) {
  return apiRequest<PlatformPayment>(`/payment-requests/${paymentId}/reject`, {
    method: 'POST',
    body: { rejectionReason },
  });
}
