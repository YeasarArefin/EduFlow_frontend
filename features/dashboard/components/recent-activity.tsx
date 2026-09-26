'use client';

import type { RecentActivityProps } from '@/types/dashboard';
import { formatDashboardDate } from '@/utils/dashboard-formatters';
import { CalendarCheck, ChevronRight, GraduationCap, Receipt, UserPlus } from 'lucide-react';
import Link from 'next/link';

function getActivityIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'attendance':
      return <CalendarCheck className="size-3.5 text-emerald-400" />;
    case 'fee':
    case 'payment':
      return <Receipt className="size-3.5 text-lime-400" />;
    case 'student':
    case 'enrollment':
      return <UserPlus className="size-3.5 text-sky-400" />;
    case 'batch':
      return <GraduationCap className="size-3.5 text-amber-400" />;
    default:
      return <CalendarCheck className="size-3.5 text-muted-foreground" />;
  }
}

export function RecentActivity({ summary }: RecentActivityProps) {
  const items = summary.operational.today.recentActivity ?? [];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      {/* Header */}
      <div>
        <h3 className="font-heading text-base font-semibold text-foreground">Recent Activity</h3>
        <p className="text-xs text-muted-foreground">
          Latest attendance, fee, and enrollment events
        </p>
      </div>

      {/* Activity Timeline List */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 p-6 text-center text-xs text-muted-foreground">
          <p>No recent activity recorded yet today.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <Link
              key={`${item.type}-${item.createdAt}-${index}`}
              href={item.href || '/workspace/dashboard'}
              className="group flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/10 p-3 transition-colors hover:border-border hover:bg-muted/30"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40">
                  {getActivityIcon(item.type)}
                </span>
                <div className="min-w-0 space-y-0.5">
                  <p className="truncate text-xs font-medium text-foreground group-hover:text-lime-400 transition-colors">
                    {item.title}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">{item.context}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {formatDashboardDate(item.createdAt)}
                </span>
                <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
