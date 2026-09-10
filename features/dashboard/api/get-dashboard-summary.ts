import { apiRequest } from '@/lib/api/client';
import type { DashboardSummary } from '@/types/dashboard';

export type { DashboardSummary } from '@/types/dashboard';

export function getDashboardSummary(workspaceId: string, signal?: AbortSignal) {
  return apiRequest<DashboardSummary>('/workspaces/dashboard-summary', {
    headers: { 'X-Workspace-Id': workspaceId },
    signal,
  });
}
