"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bulkGenerateFees,
  getFeePayments,
  getFees,
  getReceiptByNumber,
  getStudentFees,
  recordFeePayment,
  type FeeListParams,
  type RecordPaymentInput,
} from "../api/fees";
import { feeKeys } from "../fee-query-keys";

export function useFeesQuery(workspaceId: string, params: FeeListParams) {
  return useQuery({
    queryKey: feeKeys.list(workspaceId, params),
    queryFn: ({ signal }) => getFees(workspaceId, params, signal),
    enabled: Boolean(workspaceId && params.feeMonth),
    staleTime: 15_000,
  });
}

export function useFeePaymentsQuery(workspaceId: string, feeId: string | null) {
  return useQuery({
    queryKey: feeId ? feeKeys.payments(workspaceId, feeId) : ["disabled"],
    queryFn: ({ signal }) => (feeId ? getFeePayments(workspaceId, feeId, signal) : Promise.resolve([])),
    enabled: Boolean(workspaceId && feeId),
    staleTime: 15_000,
  });
}

export function useReceiptQuery(workspaceId: string, receiptNumber: string | null) {
  return useQuery({
    queryKey: receiptNumber ? feeKeys.receipt(workspaceId, receiptNumber) : ["disabled"],
    queryFn: ({ signal }) =>
      receiptNumber ? getReceiptByNumber(workspaceId, receiptNumber, signal) : Promise.resolve(null),
    enabled: Boolean(workspaceId && receiptNumber),
    staleTime: 30_000,
  });
}

export function useStudentFeesQuery(
  workspaceId: string,
  studentId: string | null,
  params?: { feeMonth?: string; status?: FeeListParams["status"]; page?: number; limit?: number },
) {
  return useQuery({
    queryKey: studentId
      ? feeKeys.studentFees(workspaceId, studentId, params)
      : ["disabled"],
    queryFn: ({ signal }) =>
      studentId
        ? getStudentFees(workspaceId, studentId, params, signal)
        : Promise.resolve({
            data: [],
            meta: { page: 1, limit: 50, total: 0, totalPages: 0 },
          }),
    enabled: Boolean(workspaceId && studentId),
    staleTime: 15_000,
  });
}

export function useRecordPaymentMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      feeId,
      input,
    }: {
      feeId: string;
      input: RecordPaymentInput;
    }) => recordFeePayment(workspaceId, feeId, input),
    onSuccess: (_, variables) => {
      // Refresh all fee list views, student fee views, and summary counters
      queryClient.invalidateQueries({ queryKey: feeKeys.all });
      queryClient.invalidateQueries({
        queryKey: feeKeys.payments(workspaceId, variables.feeId),
      });
    },
  });
}

export function useBulkGenerateFeesMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (feeMonth: string) => bulkGenerateFees(workspaceId, feeMonth),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.lists() });
    },
  });
}
