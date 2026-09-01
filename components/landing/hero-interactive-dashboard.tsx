"use client";

import { useState } from "react";
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  MessageSquare,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";

type HighlightFeature = "students" | "attendance" | "fees" | "communication" | null;

interface FeatureMeta {
  id: HighlightFeature;
  label: string;
  tooltip: string;
  icon: typeof Users;
}

const features: FeatureMeta[] = [
  {
    id: "students",
    label: "Students",
    tooltip: "Centralize learner profiles, batch enrollments, and academic history.",
    icon: Users,
  },
  {
    id: "attendance",
    label: "Attendance",
    tooltip: "Record attendance in 1-click and automatically flag low attendance.",
    icon: Calendar,
  },
  {
    id: "fees",
    label: "Fees",
    tooltip: "Track every payment. Know exactly what's due with zero guesswork.",
    icon: CreditCard,
  },
  {
    id: "communication",
    label: "Communication",
    tooltip: "Keep students and guardians informed with automatic bilingual SMS.",
    icon: MessageSquare,
  },
];

export function HeroInteractiveDashboard() {
  const [activeFeature, setActiveFeature] = useState<HighlightFeature>(null);

  const activeMeta = features.find((f) => f.id === activeFeature);

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* Floating Interactive Category Pills */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        <span className="mr-1 hidden text-xs font-medium text-muted-foreground sm:inline-flex items-center gap-1">
          <Sparkles className="size-3 text-foreground/70" />
          <span>Interactive Preview:</span>
        </span>
        {features.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeFeature === feature.id;
          return (
            <button
              key={feature.id}
              type="button"
              onMouseEnter={() => setActiveFeature(feature.id)}
              onMouseLeave={() => setActiveFeature(null)}
              onClick={() => setActiveFeature(isActive ? null : feature.id)}
              className={`group inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer select-none ${
                isActive
                  ? "border-foreground bg-foreground text-background shadow-sm scale-105"
                  : "border-border bg-background/80 text-muted-foreground hover:border-foreground/40 hover:text-foreground backdrop-blur-xs"
              }`}
            >
              <Icon className={`size-3.5 ${isActive ? "text-background" : "text-muted-foreground group-hover:text-foreground"}`} />
              <span>{feature.label}</span>
            </button>
          );
        })}
      </div>

      {/* Floating Explainer Banner when a tag is active */}
      <div
        className={`mx-auto mb-3 max-w-xl transition-all duration-300 ${
          activeMeta ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        aria-live="polite"
      >
        <div className="flex items-center justify-center gap-2 rounded-full border border-foreground/20 bg-foreground/5 px-4 py-1.5 text-center text-xs font-medium text-foreground backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{activeMeta?.tooltip || "Hover over any module to explore how EduFlow streamlines operations."}</span>
        </div>
      </div>

      {/* Main Dashboard Window Mockup */}
      <Card className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xl transition-all duration-300">
        {/* Mock Window Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-border/80 bg-muted/40 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            {/* macOS traffic light window dots */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-[#ff5f56]" />
              <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="size-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="size-5 rounded-md bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                EF
              </span>
              <span className="text-xs font-semibold text-foreground">Apex Physics Coaching</span>
              <span className="hidden rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 sm:inline-flex items-center gap-1">
                <span className="size-1 rounded-full bg-emerald-500" />
                Active Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="hidden sm:inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              <span>Monday, 10:45 AM</span>
            </span>
            <span className="rounded-full border border-border bg-surface-soft px-2.5 py-0.5 text-[11px] font-mono">
              HSC 2026 Batch
            </span>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {/* Metric 1: Students */}
            <div
              onMouseEnter={() => setActiveFeature("students")}
              onMouseLeave={() => setActiveFeature(null)}
              className={`rounded-xl border p-3.5 sm:p-4 transition-all duration-200 cursor-pointer ${
                activeFeature === "students"
                  ? "border-foreground bg-muted/60 ring-2 ring-foreground/20 shadow-sm"
                  : "border-border/80 bg-background hover:border-foreground/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Enrolled Students</span>
                <span className="flex size-6 items-center justify-center rounded-full bg-surface-soft border border-border text-foreground">
                  <Users className="size-3" />
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight font-heading text-foreground">184</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Across 6 active batches</p>
            </div>

            {/* Metric 2: Fees */}
            <div
              onMouseEnter={() => setActiveFeature("fees")}
              onMouseLeave={() => setActiveFeature(null)}
              className={`rounded-xl border p-3.5 sm:p-4 transition-all duration-200 cursor-pointer ${
                activeFeature === "fees"
                  ? "border-foreground bg-muted/60 ring-2 ring-foreground/20 shadow-sm"
                  : "border-border/80 bg-background hover:border-foreground/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Fees Collected</span>
                <span className="flex size-6 items-center justify-center rounded-full bg-surface-soft border border-border text-foreground">
                  <CreditCard className="size-3" />
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight font-heading text-foreground">৳1,42,500</p>
              <p className="mt-0.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">84% August targets met</p>
            </div>

            {/* Metric 3: Attendance */}
            <div
              onMouseEnter={() => setActiveFeature("attendance")}
              onMouseLeave={() => setActiveFeature(null)}
              className={`rounded-xl border p-3.5 sm:p-4 transition-all duration-200 cursor-pointer ${
                activeFeature === "attendance"
                  ? "border-foreground bg-muted/60 ring-2 ring-foreground/20 shadow-sm"
                  : "border-border/80 bg-background hover:border-foreground/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Today&apos;s Attendance</span>
                <span className="flex size-6 items-center justify-center rounded-full bg-surface-soft border border-border text-foreground">
                  <Calendar className="size-3" />
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight font-heading text-foreground">94.2%</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">58 of 62 students checked in</p>
            </div>

            {/* Metric 4: Communication */}
            <div
              onMouseEnter={() => setActiveFeature("communication")}
              onMouseLeave={() => setActiveFeature(null)}
              className={`rounded-xl border p-3.5 sm:p-4 transition-all duration-200 cursor-pointer ${
                activeFeature === "communication"
                  ? "border-foreground bg-muted/60 ring-2 ring-foreground/20 shadow-sm"
                  : "border-border/80 bg-background hover:border-foreground/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">SMS Notifications</span>
                <span className="flex size-6 items-center justify-center rounded-full bg-surface-soft border border-border text-foreground">
                  <Bell className="size-3" />
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight font-heading text-foreground">312</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Receipts & absence alerts</p>
            </div>
          </div>

          {/* Operational Mockup Row: Live Batch Sheet + Real-time Feed */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Live Batch Attendance & Student List (7 cols) */}
            <div
              onMouseEnter={() => setActiveFeature("attendance")}
              onMouseLeave={() => setActiveFeature(null)}
              className={`rounded-xl border p-4 lg:col-span-7 transition-all duration-200 ${
                activeFeature === "attendance" || activeFeature === "students"
                  ? "border-foreground bg-muted/30 shadow-xs"
                  : "border-border/80 bg-background"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/80">
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Live Batch Check-in</h4>
                  <p className="text-[11px] text-muted-foreground">Physics Special — Room 302</p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  In Session
                </span>
              </div>

              {/* Student Attendance List */}
              <div className="mt-3 divide-y divide-border/60">
                {[
                  { name: "Tanvir Hasan", roll: "PH-104", status: "present", time: "10:32 AM", feeStatus: "Paid" },
                  { name: "Samiya Rahman", roll: "PH-108", status: "present", time: "10:35 AM", feeStatus: "Paid" },
                  { name: "Nabil Chowdhury", roll: "PH-112", status: "absent", time: "Auto-SMS Queued", feeStatus: "Due ৳1,500" },
                ].map((item) => (
                  <div key={item.roll} className="flex items-center justify-between py-2 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-6 items-center justify-center rounded-full bg-surface-soft border border-border text-[10px] font-bold">
                        {item.name.charAt(0)}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{item.roll}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          item.status === "present"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {item.status === "present" ? (
                          <CheckCircle2 className="size-3" />
                        ) : (
                          <XCircle className="size-3" />
                        )}
                        <span className="capitalize">{item.status}</span>
                      </span>
                      <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline-block">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee Collection & Automated Communications Feed (5 cols) */}
            <div
              onMouseEnter={() => setActiveFeature("fees")}
              onMouseLeave={() => setActiveFeature(null)}
              className={`rounded-xl border p-4 lg:col-span-5 transition-all duration-200 ${
                activeFeature === "fees" || activeFeature === "communication"
                  ? "border-foreground bg-muted/30 shadow-xs"
                  : "border-border/80 bg-background"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/80">
                <h4 className="text-xs font-semibold text-foreground">Recent Activity Ledger</h4>
                <span className="text-[10px] text-muted-foreground font-mono">Real-time</span>
              </div>

              <div className="mt-3 space-y-2.5">
                <div className="rounded-lg border border-border/80 bg-surface-soft p-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">৳3,000 Fee Received</span>
                    <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">bKash Verified</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">Receipt #EF-8942 generated for Nusrat Jahan</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground/80 font-mono">Instant SMS confirmation dispatched</p>
                </div>

                <div className="rounded-lg border border-border/80 bg-surface-soft p-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Absence Alert Sent</span>
                    <span className="font-mono text-[10px] text-muted-foreground">10:40 AM</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">Guardian of Nabil Chowdhury notified via SMS</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground/80 font-mono">Template: Daily Attendance Notice</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
