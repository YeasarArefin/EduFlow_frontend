import { apiRequest } from '@/lib/api/client';
import type { PaymentRequest } from './create-payment-request';

export async function getLatestPaymentRequest() {
  return apiRequest<PaymentRequest | null>('/payment-requests/account/latest');
}
