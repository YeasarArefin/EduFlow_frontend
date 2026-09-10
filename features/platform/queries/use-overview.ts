'use client';
import { useQueries } from '@tanstack/react-query';
import { getPendingPayments, getPlatformWorkspaceOverview, getPlans } from '../api/overview';
export function usePlatformOverview() {
  const results = useQueries({
    queries: [
      { queryKey: ['platform', 'workspaces', 'overview'], queryFn: getPlatformWorkspaceOverview },
      { queryKey: ['platform', 'pending-payments'], queryFn: getPendingPayments },
      { queryKey: ['platform', 'plans'], queryFn: getPlans },
    ],
  });
  return {
    results,
    isLoading: results.some((r) => r.isLoading),
    isError: results.some((r) => r.isError),
    workspaces: results[0].data,
    payments: results[1].data,
    plans: results[2].data,
  };
}
