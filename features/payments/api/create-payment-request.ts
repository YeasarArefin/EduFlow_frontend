import { ApiError } from '@/lib/api/client';
import type {
  CreatePaymentRequestInput,
  PaymentErrorResponse,
  PaymentResponse,
} from '@/types/payments';

export type { CreatePaymentRequestInput, PaymentMethod, PaymentRequest } from '@/types/payments';

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
