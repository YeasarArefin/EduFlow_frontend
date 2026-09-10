'use client';

import { ArrowLeft, CreditCard, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiError } from '@/lib/api/client';
import type { PlatformWorkspaceDetail } from '../api/workspaces';
import { usePlatformWorkspaceDetail } from '../queries/use-workspace-detail';
import { WorkspaceEntitlementOverridesSheet } from './workspace-entitlement-overrides-sheet';
import { WorkspaceSubscriptionLifecycleControls } from './workspace-subscription-lifecycle-controls';

const workspaceStatusLabels = {
  pending: 'Pending',
  active: 'Active',
  locked: 'Locked',
  suspended: 'Suspended',
  scheduled_deletion: 'Scheduled for deletion',
  deleted: 'Deleted',
} as const;

const subscriptionStatusLabels = {
  trial: 'Trial',
  pending: 'Pending',
  active: 'Active',
  renewal_due: 'Renewal due',
  expired: 'Expired',
  cancelled: 'Cancelled',
  suspended: 'Suspended',
} as const;

const accessStatusLabels = {
  verification_pending: 'Verification pending',
  payment_pending: 'Payment pending',
  trial: 'Trial',
  active: 'Active',
  renewal_due: 'Renewal due',
  subscription_expired: 'Subscription expired',
  locked: 'Locked',
  scheduled_for_deletion: 'Scheduled for deletion',
  suspended: 'Suspended',
} as const;

function statusTone(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (status === 'active' || status === 'approved') return 'success';
  if (
    [
      'locked',
      'suspended',
      'deleted',
      'expired',
      'cancelled',
      'subscription_expired',
      'rejected',
    ].includes(status)
  )
    return 'danger';
  if (
    [
      'pending',
      'renewal_due',
      'payment_pending',
      'verification_pending',
      'scheduled_deletion',
      'scheduled_for_deletion',
    ].includes(status)
  )
    return 'warning';
  return 'info';
}

function formatDate(value: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
    date
  );
}

function formatAmount(amountMinor: string) {
  const minor = BigInt(amountMinor);
  const divisor = BigInt(100);
  return `৳${minor / divisor}.${(minor % divisor).toString().padStart(2, '0')}`;
}

function ContactValue({ value }: { value: string | null }) {
  return <dd className="text-sm text-foreground">{value || 'Not provided'}</dd>;
}

function DetailTables({ workspace }: { workspace: PlatformWorkspaceDetail }) {
  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        title="Subscription history"
        description="Most recent subscription periods recorded for this workspace."
      >
        {workspace.subscriptionHistory.length ? (
          <DataTable>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Ends</TableHead>
                <TableHead>Recorded</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspace.subscriptionHistory.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">
                    {subscription.plan?.name ?? 'No plan'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={statusTone(subscription.status)}>
                      {subscriptionStatusLabels[subscription.status]}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(subscription.startsAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(subscription.expiresAt ?? subscription.trialEndsAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(subscription.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        ) : (
          <EmptyState
            title="No subscription history"
            description="Subscription periods will appear here once the workspace enters a plan."
          />
        )}
      </SectionCard>

      <SectionCard
        title="Recent payment requests"
        description="Latest manual bKash subscription or SMS payment requests."
      >
        {workspace.recentPayments.length ? (
          <DataTable>
            <TableHeader>
              <TableRow>
                <TableHead>Purpose</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspace.recentPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="capitalize font-medium">
                    {payment.purpose.replace('_', ' ')}
                  </TableCell>
                  <TableCell>{payment.plan?.name ?? '—'}</TableCell>
                  <TableCell className="font-mono">{formatAmount(payment.amountMinor)}</TableCell>
                  <TableCell className="uppercase text-xs">{payment.method}</TableCell>
                  <TableCell>
                    <StatusBadge status={statusTone(payment.status)}>{payment.status}</StatusBadge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(payment.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        ) : (
          <EmptyState
            title="No payment requests"
            description="Payment activity for this workspace will appear here."
          />
        )}
      </SectionCard>

      <SectionCard
        title="Active entitlement overrides"
        description="Overrides currently applied on top of the workspace plan."
      >
        {workspace.activeEntitlementOverrides.length ? (
          <DataTable>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Limit</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspace.activeEntitlementOverrides.map((override) => (
                <TableRow key={override.id}>
                  <TableCell className="font-mono text-xs font-medium">
                    {override.featureKey}
                  </TableCell>
                  <TableCell>
                    {override.enabled === null
                      ? 'Plan default'
                      : override.enabled
                        ? 'Enabled'
                        : 'Disabled'}
                  </TableCell>
                  <TableCell>{override.limit ?? 'Plan default'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(override.expiresAt)}
                  </TableCell>
                  <TableCell className="max-w-72 truncate text-muted-foreground">
                    {override.reason}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        ) : (
          <EmptyState
            title="No active overrides"
            description="This workspace is currently using its plan defaults."
          />
        )}
      </SectionCard>
    </div>
  );
}

export function PlatformWorkspaceDetailPage({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [overridesOpen, setOverridesOpen] = useState(false);
  const workspaceQuery = usePlatformWorkspaceDetail(workspaceId);

  if (workspaceQuery.isPending) return <LoadingState rows={8} />;
  if (
    workspaceQuery.isError &&
    workspaceQuery.error instanceof ApiError &&
    workspaceQuery.error.status === 404
  ) {
    return (
      <EmptyState
        title="Workspace not found"
        description="This workspace may have been removed or the link may be incorrect."
        action={
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => router.push('/platform/workspaces')}
          >
            <ArrowLeft data-icon="inline-start" /> Back to workspaces
          </Button>
        }
      />
    );
  }
  if (workspaceQuery.isError) {
    return (
      <ErrorState
        message="Could not load this workspace. Please try again."
        onRetry={() => workspaceQuery.refetch()}
      />
    );
  }
  if (!workspaceQuery.data) return null;

  const detail = workspaceQuery.data;
  const { workspace, subscription, access } = detail;
  const pendingPaymentCount = detail.recentPayments.filter(
    (payment) => payment.status === 'pending'
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={workspace.name ?? 'Untitled workspace'}
        description={
          workspace.slug ? `Workspace identifier: ${workspace.slug}` : 'Platform workspace'
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => router.push('/platform/workspaces')}
          >
            <ArrowLeft data-icon="inline-start" /> Back to workspaces
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Workspace status"
          value={workspaceStatusLabels[workspace.status]}
          status={statusTone(workspace.status)}
        />
        <StatCard label="Current plan" value={subscription?.plan?.name ?? 'No plan'} />
        <StatCard
          label="Subscription"
          value={subscription ? subscriptionStatusLabels[subscription.status] : 'None'}
          status={subscription ? statusTone(subscription.status) : 'info'}
        />
        <StatCard
          label="Access"
          value={accessStatusLabels[access.status]}
          status={statusTone(access.status)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Workspace identity"
          description="Contact and identifying information for this tenant."
        >
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Workspace ID
              </dt>
              <ContactValue value={workspace.id} />
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Identifier (Slug)
              </dt>
              <ContactValue value={workspace.slug} />
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Contact Email
              </dt>
              <ContactValue value={workspace.email} />
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Contact Phone
              </dt>
              <ContactValue value={workspace.phone} />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Address
              </dt>
              <ContactValue value={workspace.address} />
            </div>
          </dl>
        </SectionCard>

        <SectionCard
          title="Lifecycle and access"
          description="The effective access state is derived from workspace and subscription conditions."
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={statusTone(workspace.status)}>
                {workspaceStatusLabels[workspace.status]}
              </StatusBadge>
              <StatusBadge status={statusTone(access.status)}>
                {accessStatusLabels[access.status]}
              </StatusBadge>
            </div>
            {access.reason && (
              <p className="text-sm text-muted-foreground bg-surface-soft border border-hairline p-3 rounded-lg">
                {access.reason}
              </p>
            )}
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Created
                </dt>
                <ContactValue value={formatDate(workspace.createdAt)} />
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Last updated
                </dt>
                <ContactValue value={formatDate(workspace.updatedAt)} />
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Activated
                </dt>
                <ContactValue value={formatDate(workspace.activatedAt)} />
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Scheduled deletion
                </dt>
                <ContactValue value={formatDate(workspace.scheduledDeleteAt)} />
              </div>
            </dl>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Current subscription"
        description="Plan coverage and the current subscription period."
      >
        {subscription ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Plan
              </span>
              <span className="font-semibold text-foreground">
                {subscription.plan?.name ?? 'No plan'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </span>
              <StatusBadge status={statusTone(subscription.status)}>
                {subscriptionStatusLabels[subscription.status]}
              </StatusBadge>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Started
              </span>
              <span className="text-sm text-foreground">{formatDate(subscription.startsAt)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Expires
              </span>
              <span className="text-sm text-foreground">
                {formatDate(subscription.expiresAt ?? subscription.trialEndsAt)}
              </span>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No current subscription"
            description="This workspace has no active subscription record."
          />
        )}
      </SectionCard>

      <DetailTables workspace={detail} />

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          title="Entitlement overrides"
          description="Grant a feature exception or a workspace-specific quota without changing the plan."
          action={
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => setOverridesOpen(true)}
            >
              <SlidersHorizontal data-icon="inline-start" /> Manage overrides
            </Button>
          }
        >
          <Alert>
            <SlidersHorizontal />
            <AlertTitle>Workspace-specific exceptions</AlertTitle>
            <AlertDescription>
              Overrides affect this workspace only. Removing one restores the current plan default.
            </AlertDescription>
          </Alert>
        </SectionCard>

        <SectionCard
          title="Subscription lifecycle"
          description="Available actions follow the current workspace and subscription state."
        >
          <WorkspaceSubscriptionLifecycleControls detail={detail} />
        </SectionCard>

        <SectionCard
          title="Payment review"
          description="Manual payment review actions will appear here when a request is pending."
          action={
            <Button size="sm" variant="outline" className="rounded-full" disabled>
              <CreditCard data-icon="inline-start" /> Review payments
            </Button>
          }
        >
          <Alert>
            <CreditCard />
            <AlertTitle>
              {pendingPaymentCount
                ? `${pendingPaymentCount} payment request${pendingPaymentCount === 1 ? '' : 's'} pending`
                : 'No payment review required'}
            </AlertTitle>
            <AlertDescription>
              Payment records are visible above. Approval and rejection actions remain unavailable
              in this phase.
            </AlertDescription>
          </Alert>
        </SectionCard>
      </div>
      <WorkspaceEntitlementOverridesSheet
        open={overridesOpen}
        onOpenChange={setOverridesOpen}
        workspaceId={workspaceId}
        planId={subscription?.plan?.id}
      />
    </div>
  );
}
