import { apiRequest } from '@/lib/api/client';

export type DashboardSummary = {
  workspace: { id: string; name: string | null; status: string };
  access: { allowed: boolean; status: string; reason: string };
  subscription: {
    status: string;
    planName: string | null;
    startsAt: string | null;
    expiresAt: string | null;
    trialEndsAt: string | null;
    renewalDueAt: string | null;
  } | null;
  memberCount: number;
  entitlements: { key: string; enabled: boolean; limit: string | null }[];
  latestPayment: { status: string; createdAt: string; reviewedAt: string | null } | null;
};

export function getDashboardSummary(workspaceId: string, signal?: AbortSignal) {
  return apiRequest<DashboardSummary>('/workspaces/dashboard-summary', {
    headers: { 'X-Workspace-Id': workspaceId },
    signal,
  });
}
