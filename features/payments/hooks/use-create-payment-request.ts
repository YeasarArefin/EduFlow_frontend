"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardingKeys } from "@/features/onboarding/hooks/use-onboarding";
import { createPaymentRequest, type CreatePaymentRequestInput } from "../api/create-payment-request";

export function useCreatePaymentRequest(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePaymentRequestInput) => createPaymentRequest(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: onboardingKeys.state(workspaceId) });
    }
  });
}
