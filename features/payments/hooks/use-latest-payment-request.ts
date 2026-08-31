"use client";

import { useQuery } from "@tanstack/react-query";
import { getLatestPaymentRequest } from "../api/get-latest-payment-request";
import type { PaymentRequest } from "../api/create-payment-request";

export const paymentKeys = {
  all: ["payment-requests"] as const,
  latest: (workspaceId: string) => ["payment-requests", "latest", workspaceId] as const
};

export function useLatestPaymentRequest(workspaceId: string, initialPayment?: PaymentRequest | null) {
  return useQuery<PaymentRequest | null>({
    queryKey: paymentKeys.latest(workspaceId),
    queryFn: () => getLatestPaymentRequest(workspaceId),
    initialData: initialPayment,
    staleTime: 15_000,
    refetchOnWindowFocus: false,
    retry: 1
  });
}
