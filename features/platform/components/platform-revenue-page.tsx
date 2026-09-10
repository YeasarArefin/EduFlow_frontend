'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import { Input } from '@/components/ui/input';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatBdt } from '@/lib/format-money';
import { useRevenueOverview } from '../queries/use-revenue-overview';

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
function tone(status: string): 'success' | 'warning' | 'danger' {
  return status === 'approved' ? 'success' : status === 'pending' ? 'warning' : 'danger';
}

export function PlatformRevenuePage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = {
    from: searchParams.get('from') || undefined,
    to: searchParams.get('to') || undefined,
  };
  const query = useRevenueOverview(params);
  const data = query.data;
  function updateUrl(updates: Record<string, string | undefined>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) =>
      value ? next.set(key, value) : next.delete(key)
    );
    router.replace(next.size ? `${pathname}?${next}` : pathname);
  }
  if (query.isPending) return <LoadingState rows={7} />;
  if (query.isError)
    return (
      <ErrorState
        message="Could not load payment and revenue activity. Please try again."
        onRetry={() => query.refetch()}
      />
    );
  if (!data) return null;
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Revenue & payments"
        description="Payment outcomes and approved revenue from submitted manual payment records."
      />
      <div className="flex flex-wrap items-end gap-3">
        <label className="grid gap-1.5 text-sm font-medium">
          From
          <Input
            type="date"
            value={params.from ?? ''}
            onChange={(event) => updateUrl({ from: event.target.value || undefined })}
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          To
          <Input
            type="date"
            value={params.to ?? ''}
            onChange={(event) => updateUrl({ to: event.target.value || undefined })}
          />
        </label>
        {params.from || params.to ? (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => updateUrl({ from: undefined, to: undefined })}
          >
            Clear dates
          </Button>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Approved revenue"
          value={formatBdt(data.metrics.approvedRevenueMinor)}
          status="success"
        />
        <StatCard
          label="Pending payments"
          value={data.metrics.pendingCount}
          detail={formatBdt(data.metrics.pendingAmountMinor)}
          status="warning"
        />
        <StatCard label="Approved payments" value={data.metrics.approvedCount} status="success" />
        <StatCard label="Rejected payments" value={data.metrics.rejectedCount} status="danger" />
        <StatCard
          label="Recent activity"
          value={data.recent.length}
          detail="Latest payment records"
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Approved revenue by plan"
          description="Only approved payment amounts are included."
        >
          {data.byPlan.length ? (
            <DataTable>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Payments</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.byPlan.map((item) => (
                  <TableRow key={item.plan?.id ?? 'no-plan'}>
                    <TableCell className="font-medium">{item.plan?.name ?? 'No plan'}</TableCell>
                    <TableCell>{item.approvedCount}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatBdt(item.revenueMinor)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          ) : (
            <EmptyState
              title="No approved revenue"
              description="Approved payments in this date range will appear by plan."
            />
          )}
        </SectionCard>
        <SectionCard
          title="Recent payment activity"
          description="Latest submitted payments and their review outcome."
        >
          {data.recent.length ? (
            <DataTable>
              <TableHeader>
                <TableRow>
                  <TableHead>Workspace</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recent.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {payment.workspace ? (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto px-0"
                          render={<Link href={`/platform/workspaces/${payment.workspace.id}`} />}
                        >
                          {payment.workspace.name ?? payment.workspace.slug ?? 'Workspace'}
                          <ExternalLink data-icon="inline-end" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">New account</span>
                      )}
                    </TableCell>
                    <TableCell>{payment.plan?.name ?? 'No plan'}</TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {formatBdt(payment.amountMinor)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={tone(payment.status)}>{payment.status}</StatusBadge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(payment.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          ) : (
            <EmptyState
              title="No payment activity"
              description="Payment submissions in this date range will appear here."
            />
          )}
        </SectionCard>
      </div>
    </div>
  );
}
