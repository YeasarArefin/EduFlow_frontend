'use client';

import Link from 'next/link';
import { ArrowRight, Building2, Layers, ShieldCheck } from 'lucide-react';
import {
  DataTable,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  SectionCard,
  StatCard,
} from '@/components/dashboard/dashboard-primitives';
import { StatusBadge } from '@/components/status/status-badge';
import { Button } from '@/components/ui/button';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePlatformOverview } from '@/features/platform/queries/use-overview';

export default function PlatformOverviewPage() {
  const overview = usePlatformOverview();

  if (overview.isLoading) {
    return <LoadingState rows={5} />;
  }

  if (overview.isError) {
    return (
      <ErrorState
        message="Could not load platform metrics. Please try again."
        onRetry={() => overview.results.forEach((r) => r.refetch())}
      />
    );
  }

  const workspaces = overview.workspaces?.data ?? [];
  const totalWorkspaces = overview.workspaces?.meta.total ?? workspaces.length;
  const activeWorkspaces = workspaces.filter((w) => w.access.status === 'active').length;
  const lockedWorkspaces = workspaces.filter((w) =>
    ['locked', 'suspended', 'scheduled_deletion', 'scheduled_for_deletion'].includes(
      w.access.status
    )
  ).length;
  const pendingWorkspaces = workspaces.filter(
    (w) =>
      ['verification_pending', 'payment_pending', 'pending'].includes(w.access.status) ||
      w.workspaceStatus === 'pending'
  ).length;
  const payments = overview.payments ?? [];
  const plans = overview.plans ?? [];
  const activePlans = plans.filter((p) => p.active ?? p.status === 'active').length;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Platform overview"
        description="Operational metrics, tenant access states, and pending platform reviews."
        actions={
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            render={<Link href="/platform/workspaces" />}
          >
            <Building2 data-icon="inline-start" /> Manage workspaces
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Total workspaces"
          value={totalWorkspaces}
          detail="All registered tenants"
        />
        <StatCard label="Active" value={activeWorkspaces} status="success" detail="Normal access" />
        <StatCard
          label="Pending"
          value={pendingWorkspaces}
          status="warning"
          detail="Awaiting action"
        />
        <StatCard
          label="Locked"
          value={lockedWorkspaces}
          status="danger"
          detail="Restricted access"
        />
        <StatCard
          label="Active plans"
          value={activePlans}
          detail={`${plans.length} total defined`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Pending payment reviews"
          description="Payment requests awaiting Platform Owner verification."
          action={
            payments.length > 0 ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                render={<Link href="/platform/workspaces" />}
              >
                Review
              </Button>
            ) : undefined
          }
        >
          {payments.length > 0 ? (
            <div className="flex flex-col gap-3">
              <DataTable>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.slice(0, 5).map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {payment.id}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status="warning">Pending review</StatusBadge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {payment.createdAt
                          ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
                              new Date(payment.createdAt)
                            )
                          : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </DataTable>
              {payments.length > 5 && (
                <p className="text-xs text-muted-foreground text-center">
                  Showing 5 of {payments.length} pending payments.
                </p>
              )}
            </div>
          ) : (
            <EmptyState
              title="No pending payments"
              description="All manual bKash and subscription payment requests have been reviewed."
            />
          )}
        </SectionCard>

        <SectionCard
          title="Quick operations"
          description="Direct access to core Platform Owner administration tools."
        >
          <div className="flex flex-col gap-3">
            <Link
              href="/platform/workspaces"
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-surface-soft border border-hairline text-foreground">
                  <Building2 className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Tenant Workspaces</p>
                  <p className="text-xs text-muted-foreground">
                    Search, filter, and inspect tenant lifecycle states
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>

            <Link
              href="/platform/plans"
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-surface-soft border border-hairline text-foreground">
                  <Layers className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Subscription Plans</p>
                  <p className="text-xs text-muted-foreground">
                    Manage feature packages, pricing, and quota limits
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>

            <Link
              href="/platform/entitlements"
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-surface-soft border border-hairline text-foreground">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Entitlement Overrides</p>
                  <p className="text-xs text-muted-foreground">
                    Configure tenant-specific quota allowances and overrides
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
