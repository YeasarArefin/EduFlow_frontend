export const platformPaymentQueryKeys = {
  all: ['platform', 'payments'] as const,
  pending: (search?: string) => [...platformPaymentQueryKeys.all, 'pending', search] as const,
};
