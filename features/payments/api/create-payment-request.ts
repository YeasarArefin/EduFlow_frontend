import { ApiError } from '@/lib/api/client';

export type PaymentMethod = 'bkash';

export type CreatePaymentRequestInput = {
  paymentMethod: PaymentMethod;
  senderNumber: string;
  transactionId: string;
};

export type PaymentRequest = {
  id: string;
  planId: string;
  amountMinor: string;
  paymentMethod: PaymentMethod;
  senderNumber: string;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
};

type PaymentResponse = { data: PaymentRequest };
type PaymentErrorResponse = { error?: { code?: string; message?: string } };

export async function createPaymentRequest(input: CreatePaymentRequestInput) {
  const response = await fetch('/api/checkout/payment-request', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => ({}))) as
    PaymentResponse | PaymentErrorResponse;
  if (!response.ok) {
    const error = 'error' in payload ? payload.error : undefined;
    throw new ApiError(
      error?.code ?? 'PAYMENT_REQUEST_FAILED',
      error?.message ?? 'The payment request could not be submitted.',
      response.status
    );
  }
  if (!('data' in payload))
    throw new ApiError(
      'INVALID_API_RESPONSE',
      'The server returned an invalid payment response.',
      response.status
    );
  return payload.data;
}
