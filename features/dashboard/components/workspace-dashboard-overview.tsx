'use client';

import {
  ErrorState,
  LoadingState,
  PageHeader,
  SectionCard,
  StatCard,
} from '@/components/dashboard-primitives';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CalendarCheck, RefreshCw, Settings, UserRoundCog, Users } from 'lucide-react';
import Link from 'next/link';
import type { DashboardSummary } from '../api/get-dashboard-summary';
import { useDashboardSummary } from '../hooks/use-dashboard-summary';
import { DashboardDetailRow } from './dashboard-detail-row';

const accessVisuals: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  active: 'success',
  trial: 'info',
  renewal_due: 'warning',
  payment_pending: 'warning',
  subscription_expired: 'danger',
  locked: 'danger',
  suspended: 'danger',
  scheduled_for_deletion: 'danger',
  verification_pending: 'warning',
};

const accessLabels: Record<string, string> = {
  active: 'Active',
  trial: 'Trial',
  renewal_due: 'Renewal due',
  payment_pending: 'Payment pending',
  subscription_expired: 'Subscription expired',
  locked: 'Locked',
  suspended: 'Suspended',
  scheduled_for_deletion: 'Deletion scheduled',
  verification_pending: 'Verification pending',
};

const quickActions = [
  {
    title: 'Students',
    description: 'Manage student records, profiles, and enrollments.',
    href: '/dashboard/students',
    icon: Users,
  },
  {
    title: 'Attendance',
    description: 'Create sessions and record daily attendance.',
    href: '/dashboard/attendance',
    icon: CalendarCheck,
  },
  {
    title: 'Staff',
    description: 'Manage workspace members and roles from your staff area.',
    href: '/dashboard/staff',
    icon: UserRoundCog,
  },
  {
    title: 'Settings',
    description: 'Review your workspace preferences and configuration.',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

function formatDate(value: string | null) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function entitlementSummary(summary: DashboardSummary) {
  const enabled = summary.entitlements.filter((item) => item.enabled);
  if (!summary.entitlements.length) return 'No plan features configured';
  return `${enabled.length} of ${summary.entitlements.length} features enabled`;
}

export function WorkspaceDashboardOverview({
  workspaceId,
  initialSummary,
}: {
  workspaceId: string;
  initialSummary?: DashboardSummary | null;
}) {
  const query = useDashboardSummary(workspaceId, initialSummary);

  if (query.isPending) return <LoadingState rows={6} />;
  if (query.isError || !query.data)
    return (
      <ErrorState
        message="We couldn't load this workspace overview. Please try again."
        onRetry={() => void query.refetch()}
      />
    );

  const summary = query.data;
  const accessLabel = accessLabels[summary.access.status] ?? summary.access.status;
  const accessVisual = accessVisuals[summary.access.status] ?? 'info';
  const dateLabel = summary.subscription?.status === 'trial' ? 'Trial ends' : 'Access until';

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={summary.workspace.name || 'Coaching overview'}
        description="Your workspace access, plan, and setup at a glance."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            <RefreshCw
              className={query.isFetching ? 'animate-spin' : undefined}
              data-icon="inline-start"
            />
            Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current plan"
          value={summary.subscription?.planName || 'No active plan'}
          detail={summary.subscription ? 'Workspace subscription' : 'Subscription setup required'}
        />
        <StatCard
          label="Workspace access"
          value={<StatusBadge status={accessVisual}>{accessLabel}</StatusBadge>}
          detail={summary.access.reason}
        />
        <StatCard
          label="Workspace members"
          value={summary.memberCount}
          detail="All workspace memberships"
        />
        <StatCard
          label="Features"
          value={summary.entitlements.filter((item) => item.enabled).length}
          detail={entitlementSummary(summary)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <SectionCard
          title="Subscription status"
          description="Current access is derived from your workspace and subscription records."
          action={<StatusBadge status={accessVisual}>{accessLabel}</StatusBadge>}
        >
          <dl className="grid gap-4 sm:grid-cols-2">
            <DashboardDetailRow
              label="Plan"
              value={summary.subscription?.planName || 'No current plan'}
            />
            <DashboardDetailRow
              label={dateLabel}
              value={formatDate(
                summary.subscription?.status === 'trial'
                  ? (summary.subscription?.trialEndsAt ?? null)
                  : (summary.subscription?.expiresAt ?? null)
              )}
            />
            <DashboardDetailRow
              label="Renewal due"
              value={formatDate(summary.subscription?.renewalDueAt ?? null)}
            />
            <DashboardDetailRow
              label="Latest payment"
              value={
                summary.latestPayment
                  ? `${summary.latestPayment.status[0].toUpperCase()}${summary.latestPayment.status.slice(1)} · ${formatDate(summary.latestPayment.createdAt)}`
                  : 'No payment request'
              }
            />
          </dl>
        </SectionCard>

        <SectionCard
          title="Plan features"
          description={entitlementSummary(summary)}
          className="lg:col-span-2"
        >
          {summary.entitlements.length ? (
            <div className="flex flex-wrap gap-2">
              {summary.entitlements.map((feature) => (
                <StatusBadge key={feature.key} status={feature.enabled ? 'success' : 'info'}>
                  {feature.key.replaceAll('_', ' ')}
                  {feature.limit ? ` · ${feature.limit}` : ''}
                </StatusBadge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Plan features will be shown once your subscription is configured.
            </p>
          )}
        </SectionCard>
      </div>

      <section aria-labelledby="quick-actions-heading" className="flex flex-col gap-4">
        <div>
          <h2
            id="quick-actions-heading"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Quick actions
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Start with the workspace areas available as EduFlow grows with your center.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Card className="h-full transition-colors duration-200 group-hover:border-accent-border group-hover:bg-card-strong">
                  <CardContent className="flex h-full flex-col items-start gap-4">
                    <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-accent text-accent-foreground">
                      <Icon className="size-4" />
                    </span>
                    <div className="flex w-full items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-foreground">{action.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="mt-1 size-4 shrink-0 text-subtle-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
