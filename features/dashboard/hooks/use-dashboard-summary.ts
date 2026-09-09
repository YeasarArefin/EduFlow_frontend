'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary, type DashboardSummary } from '../api/get-dashboard-summary';
import { dashboardKeys } from '../dashboard-query-keys';

export function useDashboardSummary(workspaceId: string, initialData?: DashboardSummary | null) {
  return useQuery({
    queryKey: dashboardKeys.summary(workspaceId),
    queryFn: ({ signal }) => getDashboardSummary(workspaceId, signal),
    initialData: initialData ?? undefined,
    staleTime: 30_000,
    retry: 1,
  });
}
