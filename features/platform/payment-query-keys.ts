export const platformPaymentQueryKeys = {
  all: ['platform', 'payments'] as const,
  pending: () => [...platformPaymentQueryKeys.all, 'pending'] as const,
};
