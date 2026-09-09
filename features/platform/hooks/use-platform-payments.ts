'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { platformWorkspaceQueryKeys } from '../workspace-query-keys';
import {
  approvePlatformPayment,
  getPendingPlatformPayments,
  rejectPlatformPayment,
} from '../api/payments';
import { platformPaymentQueryKeys } from '../payment-query-keys';

export function usePendingPlatformPayments() {
  return useQuery({
    queryKey: platformPaymentQueryKeys.pending(),
    queryFn: ({ signal }) => getPendingPlatformPayments(signal),
    staleTime: 15_000,
  });
}

export function useReviewPlatformPayment() {
  const queryClient = useQueryClient();
  const refreshRelatedData = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: platformPaymentQueryKeys.all }),
      queryClient.invalidateQueries({ queryKey: ['platform', 'pending-payments'] }),
      queryClient.invalidateQueries({ queryKey: platformWorkspaceQueryKeys.all }),
    ]);

  return useMutation({
    mutationFn: async ({
      paymentId,
      action,
      rejectionReason,
    }: {
      paymentId: string;
      action: 'approve' | 'reject';
      rejectionReason?: string;
    }) =>
      action === 'approve'
        ? approvePlatformPayment(paymentId)
        : rejectPlatformPayment(paymentId, rejectionReason ?? ''),
    onSuccess: async (_payment, variables) => {
      await refreshRelatedData();
      toast.success(
        variables.action === 'approve'
          ? 'Payment approved and subscription activated.'
          : 'Payment request rejected.'
      );
    },
    onError: async (error) => {
      if (error instanceof ApiError && error.status === 409) {
        await refreshRelatedData();
        toast.info('This payment was already reviewed. The queue has been refreshed.');
        return;
      }
      toast.error(error instanceof Error ? error.message : 'Could not review the payment request.');
    },
  });
}
