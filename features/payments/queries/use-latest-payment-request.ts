'use client';

import { useQuery } from '@tanstack/react-query';
import type { PaymentRequest } from '@/types/payments';
import { getLatestPaymentRequest } from '../api/get-latest-payment-request';

export const paymentKeys = {
  all: ['payment-requests'] as const,
  latest: ['payment-requests', 'latest', 'account'] as const,
};

export function useLatestPaymentRequest(initialPayment?: PaymentRequest | null) {
  return useQuery<PaymentRequest | null>({
    queryKey: paymentKeys.latest,
    queryFn: getLatestPaymentRequest,
    initialData: initialPayment,
    staleTime: 15_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
