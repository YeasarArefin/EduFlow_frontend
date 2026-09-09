'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPaymentRequest,
  type CreatePaymentRequestInput,
} from '../api/create-payment-request';
import { paymentKeys } from './use-latest-payment-request';

export function useCreatePaymentRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePaymentRequestInput) => createPaymentRequest(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: paymentKeys.all });
    },
  });
}
