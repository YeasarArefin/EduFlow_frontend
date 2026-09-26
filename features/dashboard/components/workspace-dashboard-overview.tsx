'use client';

import { ErrorState, LoadingState, PageHeader } from '@/components/dashboard/dashboard-primitives';
import { Button } from '@/components/ui/button';
import type { WorkspaceDashboardOverviewProps } from '@/types/dashboard';
import { BookOpen, CalendarCheck, GraduationCap, RefreshCw, UserCheck, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useDashboardSummary } from '../queries/use-dashboard-summary';
import { formatDashboardMoney } from '@/utils/dashboard-formatters';
import { FinancialOverviewPanel } from '@/features/expenses/components/finance-page';
import { FinancialCharts } from './financial-charts';
import { TodayBatches } from './today-batches';
import { RecentActivity } from './recent-activity';
import { QuickActions } from './quick-actions';

export function WorkspaceDashboardOverview({
  workspaceId,
  initialSummary,
}: WorkspaceDashboardOverviewProps) {
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

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <PageHeader
        title={summary.workspace.name || 'Coaching Overview'}
        description="Daily coaching operations, student attendance, tuition revenue, and schedule at a glance."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void query.refetch()}
              disabled={query.isFetching}
              className="rounded-full text-xs"
            >
              <RefreshCw
                className={`size-3.5 ${query.isFetching ? 'animate-spin' : ''}`}
                data-icon="inline-start"
              />
              Refresh
            </Button>
            <Button
              size="sm"
              render={<Link href="/workspace/attendance" />}
              className="rounded-full shadow-sm text-xs"
            >
              <CalendarCheck data-icon="inline-start" /> Take Attendance
            </Button>
          </div>
        }
      />

      {/* Row 1: General Info (4 KPI Stat Cards) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Active Students */}
        <Link
          href="/workspace/students"
          className="group rounded-2xl border border-border bg-card p-4 transition-colors hover:border-border-strong hover:bg-muted/10"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Active Students</span>
            <GraduationCap className="size-4 text-lime-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground group-hover:text-lime-400 transition-colors">
            {summary.operational.activeStudents}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Currently enrolled learners</p>
        </Link>

        {/* Active Batches */}
        <Link
          href="/workspace/batches"
          className="group rounded-2xl border border-border bg-card p-4 transition-colors hover:border-border-strong hover:bg-muted/10"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Active Batches</span>
            <BookOpen className="size-4 text-lime-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground group-hover:text-lime-400 transition-colors">
            {summary.operational.activeBatches}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {summary.operational.today.scheduledBatchCount} scheduled for today
          </p>
        </Link>

        {/* Attendance Today */}
        <Link
          href="/workspace/attendance"
          className="group rounded-2xl border border-border bg-card p-4 transition-colors hover:border-border-strong hover:bg-muted/10"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Today&apos;s Attendance</span>
            <UserCheck className="size-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-400">
            {summary.operational.today.attendance.presentCount} Present
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {summary.operational.today.attendance.finalizedSessionCount} finalized session
            {summary.operational.today.attendance.finalizedSessionCount === 1 ? '' : 's'}
          </p>
        </Link>

        {/* Fees Collected */}
        <Link
          href="/workspace/fees"
          className="group rounded-2xl border border-border bg-card p-4 transition-colors hover:border-border-strong hover:bg-muted/10"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Fees Collected (This Month)</span>
            <Wallet className="size-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold tracking-tight text-foreground group-hover:text-emerald-400 transition-colors">
            {formatDashboardMoney(summary.operational.monthlyFinance.collectedFees)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDashboardMoney(summary.operational.monthlyFinance.outstandingFees)} outstanding
          </p>
        </Link>
      </div>

      {/* Row 2: Financial Overview */}
      <FinancialCharts summary={summary} />

      {/* Row 3: Detailed financial overview */}
      <FinancialOverviewPanel workspaceId={workspaceId} />

      {/* Row 4: Class Schedule */}
      <TodayBatches summary={summary} />

      {/* Row 5: Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <QuickActions />
        <RecentActivity summary={summary} />
      </div>
    </div>
  );
}
