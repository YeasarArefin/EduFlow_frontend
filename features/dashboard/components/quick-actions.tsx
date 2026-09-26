'use client';

import { dashboardQuickActions } from '@/utils/dashboard-formatters';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  return (
    <div className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5">
      <div>
        <h3 className="font-heading text-base font-semibold text-foreground">Quick Actions</h3>
        <p className="text-xs text-muted-foreground">
          Fast shortcuts for daily coaching operations
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {dashboardQuickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex flex-col justify-between gap-2.5 rounded-xl border border-border/60 bg-muted/10 p-3 transition-all hover:border-border hover:bg-muted/30"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-7 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-lime-400">
                  <Icon className="size-3.5" />
                </span>
                <ArrowRight className="size-3 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-foreground" />
              </div>

              <div>
                <h4 className="text-xs font-semibold text-foreground group-hover:text-lime-400 transition-colors">
                  {action.title}
                </h4>
                <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
