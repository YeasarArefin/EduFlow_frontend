'use client';

import { useMemo } from 'react';
import type { FinancialChartsProps } from '@/types/dashboard';
import { formatDashboardMoney } from '@/utils/dashboard-formatters';
import { ArrowUpRight, CreditCard } from 'lucide-react';
import Link from 'next/link';
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number | string }>;
  label?: string;
}

function CustomLineTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-popover/95 px-3 py-2 text-xs shadow-md backdrop-blur-md">
        <p className="font-medium text-foreground">
          {label
            ? new Date(label).toLocaleDateString('en-BD', {
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
              })
            : 'Month'}
        </p>
        <p className="mt-0.5 font-mono font-semibold text-lime-400">
          Collected: {formatDashboardMoney(String(payload[0].value ?? 0))}
        </p>
      </div>
    );
  }
  return null;
}

export function FinancialCharts({ summary }: FinancialChartsProps) {
  const finance = summary.operational.monthlyFinance;
  const collections = summary.monthlyCollections;
  const collectedNum = Number(finance?.collectedFees || 0);
  const outstandingNum = Number(finance?.outstandingFees || 0);

  const chartData = useMemo(() => {
    return (collections ?? []).map((item) => ({
      month: item.month,
      collectedFees: Number(item.collectedFees || 0),
    }));
  }, [collections]);

  const breakdown = useMemo(() => {
    const total = collectedNum + outstandingNum;
    if (total === 0) {
      return [{ name: 'No fee records this month', value: 1, color: 'rgba(255, 255, 255, 0.1)' }];
    }
    return [
      { name: 'Collected Fees', value: collectedNum, color: 'hsl(var(--primary))' },
      { name: 'Outstanding Dues', value: outstandingNum, color: 'rgba(251, 191, 36, 0.85)' },
    ];
  }, [collectedNum, outstandingNum]);

  const hasData = collections.length > 0 || collectedNum > 0 || outstandingNum > 0;

  if (!hasData) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
        <div>
          <h3 className="font-heading text-base font-semibold text-foreground">
            Financial Overview
          </h3>
          <p className="text-xs text-muted-foreground">Tuition revenue and monthly cash flow</p>
        </div>
        <div className="rounded-xl border border-dashed border-border/70 p-8 text-center text-xs text-muted-foreground">
          <CreditCard className="mx-auto mb-2 size-7 opacity-40" />
          <p className="font-medium text-foreground">No financial data recorded yet</p>
          <p className="mt-1 text-muted-foreground">
            Generate monthly fee snapshots and record payments to populate revenue analytics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-base font-semibold text-foreground">
            Financial Overview
          </h3>
          <p className="text-xs text-muted-foreground">
            Fee collections trend and monthly cash flow
          </p>
        </div>

        <Link
          href="/workspace/fees"
          className="inline-flex items-center gap-1 text-xs font-medium text-lime-400 hover:underline transition-colors"
        >
          <span>Fee Management</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      {/* Chart Grid */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Trend Line Chart (7 cols) */}
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-border/60 bg-muted/10 p-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Collection Trend (Recent Months)
            </h4>
            <span className="font-mono text-xs font-medium text-lime-400">
              {collections.length} Months
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 12, right: 16, left: 8, bottom: 6 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  className="text-border/40"
                />
                <XAxis
                  dataKey="month"
                  tickFormatter={(v) =>
                    new Date(v).toLocaleDateString('en-BD', {
                      month: 'short',
                      timeZone: 'UTC',
                    })
                  }
                  stroke="currentColor"
                  className="text-[11px] text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  dy={6}
                />
                <YAxis
                  width={52}
                  tickFormatter={(v) => `৳${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  stroke="currentColor"
                  className="text-[11px] text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  dx={-4}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="collectedFees"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={{ fill: 'hsl(var(--primary))', r: 3.5 }}
                  activeDot={{ r: 5.5, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Breakdown Donut (5 cols) */}
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-border/60 bg-muted/10 p-4 lg:col-span-5">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              This Month&apos;s Settlement
            </h4>
          </div>

          {/* Donut Visual & Legend */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={42}
                    outerRadius={62}
                    paddingAngle={3}
                  >
                    {breakdown.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      collectedNum + outstandingNum === 0
                        ? 'No data'
                        : formatDashboardMoney(String(value ?? 0)),
                      String(name),
                    ]}
                    contentStyle={{
                      borderRadius: '12px',
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--popover)',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Clear Legend */}
            <div className="flex w-full items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">Collected</span>
                <span className="font-mono font-medium text-foreground">
                  {formatDashboardMoney(finance?.collectedFees || '0')}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-amber-400" />
                <span className="text-muted-foreground">Due</span>
                <span className="font-mono font-medium text-foreground">
                  {formatDashboardMoney(finance?.outstandingFees || '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Sub-metrics */}
          <div className="grid grid-cols-2 gap-2 border-t border-border/40 pt-3 text-[11px]">
            <div>
              <span className="block text-muted-foreground">Salaries Paid</span>
              <span className="font-mono font-medium text-foreground">
                {formatDashboardMoney(finance?.paidSalaries || '0')}
              </span>
            </div>
            <div>
              <span className="block text-muted-foreground">Coaching Expenses</span>
              <span className="font-mono font-medium text-foreground">
                {formatDashboardMoney(finance?.expenses || '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
