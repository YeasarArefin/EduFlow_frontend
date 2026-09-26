'use client';
import { useMemo, useState } from 'react';
import { TrendingDown, TrendingUp, WalletCards } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SectionCard,
  StatCard,
} from '@/components/dashboard/dashboard-primitives';
import type { WorkspacePageProps } from '@/types/expenses';
import { formatFeeCurrency as formatCurrency } from '@/utils/fee-formatters';
import { useFinancialOverview } from '../queries/use-expenses';

const today = new Date().toISOString().slice(0, 10);
const firstOfYear = `${today.slice(0, 4)}-01-01`;
export function FinancialOverviewPanel({ workspaceId }: WorkspacePageProps) {
  const [startDate, setStartDate] = useState(firstOfYear);
  const [endDate, setEndDate] = useState(today);
  const query = useFinancialOverview(workspaceId, startDate, endDate);
  const maximum = useMemo(
    () =>
      Math.max(
        1,
        ...(query.data?.monthly.map((item) =>
          Math.max(Number(item.income), Number(item.salaries) + Number(item.otherExpenses))
        ) ?? [])
      ),
    [query.data]
  );
  if (query.isPending) return <LoadingState rows={6} />;
  if (query.isError)
    return (
      <ErrorState
        message="Could not load the financial overview."
        onRetry={() => query.refetch()}
      />
    );
  const data = query.data;
  if (!data) return null;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Financial overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Actual cash collected and paid, calculated from payment dates.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 rounded-xl border border-border bg-card p-4">
        <div className="grid gap-1.5">
          <label className="text-sm font-medium">From</label>
          <Input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium">To</label>
          <Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Student fees collected"
          value={formatCurrency(data.collectedFees)}
          detail="Actual payment receipts"
          status="success"
        />
        <StatCard
          label="Teacher salaries paid"
          value={formatCurrency(data.paidTeacherSalaries)}
          detail="Salary payment records"
          status="warning"
        />
        <StatCard
          label="Other expenses"
          value={formatCurrency(data.otherExpenses)}
          detail="Active expense entries"
          status="danger"
        />
        <StatCard
          label="Net income"
          value={formatCurrency(data.netIncome)}
          detail={`Total expenditure ${formatCurrency(data.totalExpenditure)}`}
          status={Number(data.netIncome) >= 0 ? 'success' : 'danger'}
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <SectionCard
          title="Income vs expenditure"
          description="Monthly amounts in BDT for the selected period"
          action={<WalletCards className="size-5 text-primary" />}
        >
          <div className="flex h-64 items-end gap-2 overflow-x-auto pb-6 pt-5">
            {data.monthly.length ? (
              data.monthly.map((item) => {
                const expenditure = Number(item.salaries) + Number(item.otherExpenses);
                return (
                  <div
                    className="flex h-full min-w-12 flex-1 flex-col justify-end gap-1"
                    key={item.month}
                    title={`${item.month}: income ${formatCurrency(item.income)}, expenditure ${formatCurrency(expenditure)}`}
                  >
                    <div className="flex flex-1 items-end gap-1">
                      <div
                        className="w-1/2 rounded-t bg-primary/85 transition-[height]"
                        style={{ height: `${(Number(item.income) / maximum) * 100}%` }}
                      />
                      <div
                        className="w-1/2 rounded-t bg-destructive/70 transition-[height]"
                        style={{ height: `${(expenditure / maximum) * 100}%` }}
                      />
                    </div>
                    <span className="truncate text-center text-[10px] text-muted-foreground">
                      {new Date(`${item.month}T00:00:00`).toLocaleDateString('en-US', {
                        month: 'short',
                      })}
                    </span>
                  </div>
                );
              })
            ) : (
              <EmptyState
                title="No financial activity"
                description="Payments and expenses in this date range will appear here."
              />
            )}
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <i className="size-2 rounded-full bg-primary" />
              Income
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="size-2 rounded-full bg-destructive/70" />
              Expenditure
            </span>
          </div>
        </SectionCard>
        <SectionCard
          title="Expense categories"
          description="Active, non-reversed expense totals"
          action={<TrendingDown className="size-5 text-destructive" />}
        >
          {data.categoryBreakdown.length ? (
            <div className="space-y-4">
              {data.categoryBreakdown.map((category) => {
                const share = Number(data.otherExpenses)
                  ? (Number(category.amount) / Number(data.otherExpenses)) * 100
                  : 0;
                return (
                  <div key={category.name}>
                    <div className="mb-1.5 flex justify-between gap-3 text-sm">
                      <span>{category.name}</span>
                      <span className="font-medium tabular-nums">
                        {formatCurrency(category.amount)}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No expenses yet"
              description="Expense categories will be summarized here once costs are recorded."
            />
          )}
        </SectionCard>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="size-4 text-primary" />
        Salary payments are counted from their own payment records once only, never from salary
        balances.
      </div>
    </div>
  );
}
