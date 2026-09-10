'use client';

import { useState } from 'react';
import { ArrowUpRight, Calendar, CreditCard, MessageSquare, Sparkles, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type HighlightCategory = 'all' | 'fees' | 'attendance' | 'students' | 'communication';

export function HeroInteractiveDashboard() {
  const [activeTab, setActiveTab] = useState<HighlightCategory>('all');

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      {/* Category Filter Pills */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        <span className="mr-1 hidden text-xs font-medium text-muted-foreground sm:inline-flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-accent-foreground" />
          <span>Interactive Workspace:</span>
        </span>
        {[
          { id: 'all', label: 'Full Pulse', icon: Sparkles },
          { id: 'fees', label: 'Fee Ledger', icon: CreditCard },
          { id: 'attendance', label: 'Attendance', icon: Calendar },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'communication', label: 'SMS Alerts', icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as HighlightCategory)}
              className={cn(
                'inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200',
                isActive
                  ? 'scale-105 border-primary bg-primary text-primary-foreground font-semibold shadow-[0_0_20px_var(--glow-lime)]'
                  : 'border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground backdrop-blur-md'
              )}
            >
              <Icon
                className={cn(
                  'size-3.5',
                  isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                )}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Dashboard Container */}
      <div
        data-premium-tilt
        className="relative overflow-hidden rounded-[24px] border border-border bg-card p-5 shadow-[var(--shadow-elevated)] backdrop-blur-[16px] sm:p-7"
      >
        {/* Top Right Atmospheric Radial Light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-40 size-[380px] rounded-full bg-[rgba(190,242,100,0.09)] blur-[85px]"
        />

        {/* Dash Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-center">
          <div>
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Live Environment · Apex Physics Coaching
            </span>
            <h2 className="font-heading text-xl font-medium tracking-[-0.03em] text-foreground sm:text-2xl">
              Operations Command Pulse
            </h2>
          </div>
          <div className="inline-flex self-start items-center gap-2 rounded-full border border-accent-border bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground sm:self-auto">
            <span className="size-2 animate-pulse rounded-full bg-primary shadow-[0_0_8px_var(--glow-lime)]" />
            <span>Live sync · 38ms</span>
          </div>
        </div>

        {/* 4 KPIs Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {/* KPI 1 */}
          <div
            data-premium-tilt
            className="relative min-h-[132px] overflow-hidden rounded-2xl border border-border bg-card-strong p-4.5 sm:p-5"
          >
            <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
              Net Tuition Collected
            </span>
            <div className="mt-3 font-heading text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-3xl">
              ৳385K
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-accent-foreground">
              <ArrowUpRight className="size-3.5" />
              <span>18.7% this month</span>
            </div>
            {/* Sparkline */}
            <div className="absolute right-3 bottom-3 w-[78px] h-[34px] opacity-70">
              <svg viewBox="0 0 100 40" fill="none" className="size-full text-accent-foreground">
                <path
                  d="M0 30 C18 31, 20 13, 38 18 S65 4, 100 8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* KPI 2 */}
          <div
            data-premium-tilt
            className="relative min-h-[132px] overflow-hidden rounded-2xl border border-border bg-card-strong p-4.5 sm:p-5"
          >
            <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
              Avg Attendance Rate
            </span>
            <div className="mt-3 font-heading text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-3xl">
              94.6%
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-accent-foreground">
              <ArrowUpRight className="size-3.5" />
              <span>2.4 pts vs target</span>
            </div>
            {/* Sparkline */}
            <div className="absolute right-3 bottom-3 w-[78px] h-[34px] opacity-70">
              <svg viewBox="0 0 100 40" fill="none" className="size-full text-accent-foreground">
                <path
                  d="M0 27 C16 16, 24 28, 37 20 S67 14, 100 7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* KPI 3 */}
          <div
            data-premium-tilt
            className="relative min-h-[132px] overflow-hidden rounded-2xl border border-border bg-card-strong p-4.5 sm:p-5"
          >
            <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
              Active Enrollments
            </span>
            <div className="mt-3 font-heading text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-3xl">
              248
            </div>
            <div className="mt-2 text-xs text-muted-foreground">8 active batches</div>
          </div>

          {/* KPI 4 */}
          <div
            data-premium-tilt
            className="relative min-h-[132px] overflow-hidden rounded-2xl border border-border bg-card-strong p-4.5 sm:p-5"
          >
            <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
              Dues Status
            </span>
            <div className="mt-3 font-heading text-2xl font-medium tracking-[-0.04em] text-accent-foreground sm:text-3xl">
              Nominal
            </div>
            <div className="mt-2 text-xs text-muted-foreground">92.2% invoices cleared</div>
          </div>
        </div>

        {/* Main Grid: Chart + Insights */}
        <div className="mt-3.5 grid gap-3.5 lg:grid-cols-[1.55fr_0.75fr]">
          {/* Chart Card */}
          <div
            data-premium-tilt
            className="rounded-2xl border border-border bg-card p-5 backdrop-blur-md sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading text-base font-medium tracking-[-0.02em] text-foreground sm:text-lg">
                  Tuition Collection Velocity
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Rolling 12-day payment throughput
                </p>
              </div>
              <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground-soft">
                12 Days ▾
              </span>
            </div>

            {/* Custom Technical Bar Chart with Repeating Gridlines */}
            <div
              className="relative mt-6 h-[220px] overflow-hidden rounded-lg border-b border-l border-border sm:h-[245px]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to bottom, transparent 0, transparent 48px, var(--grid-line) 49px)',
              }}
            >
              <div className="absolute inset-x-4 inset-y-4 flex items-end justify-between gap-2 sm:gap-3">
                {[
                  { h: '35%', label: 'D1' },
                  { h: '48%', label: 'D2' },
                  { h: '42%', label: 'D3' },
                  { h: '62%', label: 'D4' },
                  { h: '57%', label: 'D5' },
                  { h: '77%', label: 'D6' },
                  { h: '68%', label: 'D7' },
                  { h: '88%', label: 'D8' },
                  { h: '81%', label: 'D9' },
                  { h: '94%', label: 'D10' },
                  { h: '85%', label: 'D11' },
                  { h: '100%', label: 'D12' },
                ].map((bar, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center h-full justify-end">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-700 ${
                        index % 2 === 0
                          ? 'bg-gradient-to-t from-[rgba(190,242,100,0.45)] to-[rgba(190,242,100,0.08)] border-t border-[rgba(190,242,100,0.5)] shadow-[0_-8px_24px_rgba(190,242,100,0.08)]'
                          : 'bg-gradient-to-t from-[rgba(16,185,129,0.3)] to-[rgba(16,185,129,0.05)] border-t border-[rgba(16,185,129,0.4)]'
                      }`}
                      style={{ height: bar.h }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Stack Insights */}
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
            {/* Insight 1 */}
            <div
              data-premium-tilt
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 backdrop-blur-md"
            >
              {/* Glowing Orb */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 -right-10 size-[130px] rounded-full bg-[rgba(190,242,100,0.08)] blur-[38px]"
              />
              <div>
                <div className="flex size-11 items-center justify-center rounded-xl border border-border-strong bg-muted text-lg font-bold text-accent-foreground">
                  ↗
                </div>
                <h4 className="mt-4 font-heading text-sm font-medium text-foreground sm:text-base">
                  Batch Alpha Roll Call Logged
                </h4>
                <p className="mt-1.5 text-xs font-light leading-relaxed text-muted-foreground">
                  26 Present, 2 Absent. 2 bilingual SMS alerts dispatched instantly to parents.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] text-subtle-foreground">
                <span>Today · 4:35 PM</span>
                <span className="font-medium text-accent-foreground">Auto-Delivered</span>
              </div>
            </div>

            {/* Insight 2 */}
            <div
              data-premium-tilt
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 backdrop-blur-md"
            >
              <div>
                <div className="flex size-11 items-center justify-center rounded-xl border border-border-strong bg-muted text-lg font-bold text-accent-foreground">
                  ◎
                </div>
                <h4 className="mt-4 font-heading text-sm font-medium text-foreground sm:text-base">
                  Fee Collection Rate: 92.2%
                </h4>
                <p className="mt-1.5 text-xs font-light leading-relaxed text-muted-foreground">
                  ৳385,000 cleared across SSC & HSC Physics cohorts. 14 pending dues flagged with
                  1-click reminders.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] text-subtle-foreground">
                <span>Ledger Synced</span>
                <span className="font-mono text-muted-foreground">14 Invoices</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
