import { headers } from 'next/headers';
import { serverEnv } from '@/config/server-env';
import type { DashboardSummary, DashboardSummaryResponse } from '@/types/dashboard';

export async function getDashboardSummaryServer(
  workspaceId: string
): Promise<DashboardSummary | null> {
  const cookie = (await headers()).get('cookie') ?? '';
  try {
    const response = await fetch(`${serverEnv.apiBaseUrl}/workspaces/dashboard-summary`, {
      headers: { Accept: 'application/json', cookie, 'X-Workspace-Id': workspaceId },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as DashboardSummaryResponse;
    return payload.data ?? null;
  } catch {
    return null;
  }
}
