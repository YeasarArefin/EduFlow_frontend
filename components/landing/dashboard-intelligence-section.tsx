import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  TrendingUp,
  Users,
} from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import { Card, CardTitle } from "@/components/ui/card";

const weeklyAttendance = [
  { day: "Sat", rate: 94 },
  { day: "Sun", rate: 96 },
  { day: "Mon", rate: 92 },
  { day: "Tue", rate: 95 },
  { day: "Wed", rate: 97 },
  { day: "Thu", rate: 93 },
];

const upcomingClasses = [
  {
    batch: "HSC Physics · Batch Alpha",
    room: "Room 201",
    time: "4:30 PM - 6:00 PM",
    teacher: "Dr. Salman",
    students: 28,
  },
  {
    batch: "HSC Chemistry · Batch Beta",
    room: "Room 104",
    time: "6:15 PM - 7:45 PM",
    teacher: "Prof. Anisul",
    students: 24,
  },
  {
    batch: "SSC Math · Batch Gamma",
    room: "Room 302",
    time: "8:00 PM - 9:30 PM",
    teacher: "Nabila Karim",
    students: 32,
  },
];

const recentActivity = [
  {
    type: "fee",
    title: "Fee Receipt #INV-1092 Verified",
    desc: "৳3,500 received via bKash from Tanvir Hasan",
    time: "3 mins ago",
    badge: "bKash",
  },
  {
    type: "attendance",
    title: "Batch Alpha Attendance Logged",
    desc: "26 present, 2 absent · 2 guardian SMS alerts sent",
    time: "14 mins ago",
    badge: "Attendance",
  },
  {
    type: "student",
    title: "New Student Enrollment",
    desc: "Mehedi Hasan enrolled in HSC Physics Batch Beta",
    time: "42 mins ago",
    badge: "Enrolled",
  },
];

export function DashboardIntelligenceSection() {
  return (
    <section className="border-b border-border py-20 sm:py-28 lg:py-32 bg-background-subtle" id="overview">
      <PublicContainer>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.20em] text-accent-foreground">
            Operational Intelligence
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            Understand your coaching center at a glance.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg font-light">
            Real-time enrollment health, fee collection trends, attendance rates, and upcoming schedules—organized
            into a clear operational dashboard.
          </p>
        </div>

        {/* Top 4 KPI Metric Cards */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card data-premium-tilt className="rounded-2xl border border-border bg-card p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-light">Active Students</span>
              <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-accent-foreground">
                <Users className="size-3.5" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-heading text-3xl font-semibold text-foreground tracking-tight">248</span>
              <span className="inline-flex items-center text-xs font-semibold text-accent-foreground">
                <ArrowUpRight className="size-3" /> +12%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground/60">Across 8 active batches</p>
          </Card>

          <Card data-premium-tilt className="rounded-2xl border border-border bg-card p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-light">Fees Collected</span>
              <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-accent-foreground">
                <CreditCard className="size-3.5" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-heading text-3xl font-semibold text-foreground tracking-tight">৳385,000</span>
              <span className="inline-flex items-center text-xs font-semibold text-accent-foreground">
                <ArrowUpRight className="size-3" /> 92.2%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground/60">August tuition collected</p>
          </Card>

          <Card data-premium-tilt className="rounded-2xl border border-border bg-card p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-light">Outstanding Dues</span>
              <span className="flex size-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
                <Clock className="size-3.5" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-heading text-3xl font-semibold text-rose-400 tracking-tight">৳32,500</span>
              <span className="text-[11px] text-muted-foreground/60">14 Invoices</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground/60">Automated reminders ready</p>
          </Card>

          <Card data-premium-tilt className="rounded-2xl border border-border bg-card p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-light">Attendance Rate</span>
              <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-accent-foreground">
                <TrendingUp className="size-3.5" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-heading text-3xl font-semibold text-accent-foreground tracking-tight">94.6%</span>
              <span className="text-[11px] text-muted-foreground">Weekly Avg</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground/60">12 alerts dispatched today</p>
          </Card>
        </div>

        {/* Dashboard Split: Upcoming Schedule & Attendance Graph vs Live Activity Feed */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left Column (2 spans): Upcoming Classes & Weekly Attendance */}
          <div className="space-y-6 lg:col-span-2">
            {/* Upcoming Classes */}
            <Card data-premium-tilt className="rounded-2xl border border-border bg-card p-6 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <Calendar className="size-4 text-accent-foreground" />
                  <CardTitle className="text-base font-semibold text-foreground font-heading">
                    Today&apos;s Class Schedule
                  </CardTitle>
                </div>
                <span className="text-xs font-mono text-muted-foreground">3 Sessions Scheduled</span>
              </div>
              <div className="mt-4 space-y-3">
                {upcomingClasses.map((item) => (
                  <div
                    key={item.batch}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-border bg-muted/40 p-3.5 hover:border-border-strong transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">{item.batch}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Instructor: <span className="text-foreground-soft">{item.teacher}</span> · {item.room}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-muted-foreground border border-border">
                        {item.time}
                      </span>
                      <span className="text-xs text-accent-foreground font-semibold">{item.students} Enrolled</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Weekly Attendance Consistency Chart */}
            <Card data-premium-tilt className="rounded-2xl border border-border bg-card p-6 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <CardTitle className="text-base font-semibold text-foreground font-heading">
                    Weekly Attendance Consistency
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Average attendance across all registered batches</p>
                </div>
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground border border-accent-border">
                  94.6% Avg
                </span>
              </div>
              <div className="mt-6 flex items-end justify-between gap-2 pt-4">
                {weeklyAttendance.map((bar) => (
                  <div key={bar.day} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">{bar.rate}%</span>
                    <div className="w-full max-w-[48px] h-28 rounded-lg bg-muted p-1 flex items-end">
                      <div
                        className="w-full rounded-md bg-gradient-to-t from-chart-3 to-primary shadow-[0_0_8px_var(--glow-lime)] transition-all"
                        style={{ height: `${bar.rate}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{bar.day}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column (1 span): Live Operational Activity */}
          <Card data-premium-tilt className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 backdrop-blur-md">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary shadow-[0_0_6px_rgba(190,242,100,0.8)]" />
                  <CardTitle className="text-base font-semibold text-foreground font-heading">
                    Live Center Activity
                  </CardTitle>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">Real-Time</span>
              </div>
              <div className="mt-4 space-y-4">
                {recentActivity.map((act, i) => (
                  <div key={i} className="flex items-start gap-3 border-b border-border pb-4 last:border-0 last:pb-0">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-accent-foreground border border-border">
                      <CheckCircle2 className="size-3.5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="truncate text-xs font-medium text-foreground">{act.title}</p>
                        <span className="text-[10px] text-muted-foreground/60 shrink-0 font-mono">{act.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed font-light">{act.desc}</p>
                      <span className="mt-1.5 inline-block rounded-full bg-muted border border-border px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                        {act.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-muted/40 p-3 text-center">
              <p className="text-xs text-muted-foreground font-light">
                All actions are logged in the immutable audit ledger.
              </p>
            </div>
          </Card>
        </div>
      </PublicContainer>
    </section>
  );
}
