import { WorkspaceDashboardOverview } from '@/features/dashboard/components/workspace-dashboard-overview';
import { getDashboardSummaryServer } from '@/features/dashboard/api/get-dashboard-summary-server';
import { getAccountRoutingState } from '@/lib/auth/post-auth-destination';

export default async function DashboardPage() {
  const account = await getAccountRoutingState();
  const workspaceId = account?.workspaceId;
  if (!workspaceId) return null;
  const summary = await getDashboardSummaryServer(workspaceId);
  return <WorkspaceDashboardOverview workspaceId={workspaceId} initialSummary={summary} />;
}
