import {
  CalendarCheck,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CoreWorkflowsSection() {
  return (
    <section className="border-b border-border/80 py-20 sm:py-28 lg:py-32" id="features">
      <PublicContainer>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Complete Coaching Operations
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Engineered for every phase of your coaching day.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            No fragmented add-ons or disjointed tools. Every module in EduFlow shares the same student
            roster, fee ledger, and communication pipeline.
          </p>
        </div>

        {/* 5 Major Workflows Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Workflow 1: Manage Students */}
          <Card className="flex flex-col justify-between overflow-hidden border-border/80 bg-card hover:border-foreground/30 transition-all">
            <CardHeader className="pb-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Users className="size-5" />
              </div>
              <CardTitle className="mt-4 text-xl">1. Manage Students</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Complete student profiles, guardian phone records, roll numbers, custom batch tags, and
                academic enrollment history in one searchable directory.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Authentic UI Mini-Mockup */}
              <div className="rounded-xl border border-border bg-surface-soft p-3 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-semibold text-foreground">Tanvir Hasan</span>
                  <span className="rounded-full bg-surface-card border px-2 py-0.5 text-[10px] font-mono">PH-104</span>
                </div>
                <div className="text-[11px] text-muted-foreground space-y-1">
                  <p>Guardian: Md. Hasan (+880 1712-345678)</p>
                  <div className="flex gap-1.5 pt-1">
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px]">HSC Physics</span>
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px]">Batch A</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflow 2: Run Classes & Batches */}
          <Card className="flex flex-col justify-between overflow-hidden border-border/80 bg-card hover:border-foreground/30 transition-all">
            <CardHeader className="pb-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CalendarCheck className="size-5" />
              </div>
              <CardTitle className="mt-4 text-xl">2. Run Classes & Batches</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Organize weekly batch schedules, assign instructors and classrooms, and record daily attendance
                with instant low-attendance alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Authentic UI Mini-Mockup */}
              <div className="rounded-xl border border-border bg-surface-soft p-3 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-semibold text-foreground">HSC 2026 Batch B</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">92% Present</span>
                </div>
                <div className="text-[11px] text-muted-foreground flex justify-between">
                  <span>Room 201 • Mon / Wed 4:00 PM</span>
                  <span className="font-mono text-foreground font-semibold">28 Enrolled</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflow 3: Manage Money & Fees */}
          <Card className="flex flex-col justify-between overflow-hidden border-border/80 bg-card hover:border-foreground/30 transition-all">
            <CardHeader className="pb-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CreditCard className="size-5" />
              </div>
              <CardTitle className="mt-4 text-xl">3. Manage Money & Fees</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Automated monthly tuition schedules, partial payment support, scholarship discounts, instant digital
                receipts, and teacher payroll tracking.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Authentic UI Mini-Mockup */}
              <div className="rounded-xl border border-border bg-surface-soft p-3 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-semibold text-foreground">August Monthly Tuition</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">৳3,000 Paid</span>
                </div>
                <div className="text-[11px] text-muted-foreground flex justify-between items-center">
                  <span>Receipt #EF-8942</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">bKash Verified</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflow 4: Automated Communication */}
          <Card className="flex flex-col justify-between overflow-hidden border-border/80 bg-card hover:border-foreground/30 transition-all">
            <CardHeader className="pb-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MessageSquare className="size-5" />
              </div>
              <CardTitle className="mt-4 text-xl">4. Communicate with Parents</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Automated SMS for absence alerts, payment receipts, fee due reminders, and exam notices with
                support for bilingual Bangla & English message templates.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Authentic UI Mini-Mockup */}
              <div className="rounded-xl border border-border bg-surface-soft p-3 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-semibold text-foreground">Guardian SMS Alert</span>
                  <span className="text-[10px] text-muted-foreground font-mono">Delivered</span>
                </div>
                <p className="text-[11px] text-muted-foreground italic">
                  &quot;Dear Guardian, Nabil was absent from Physics Batch A today (12 Aug). Contact: 01712...&quot;
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Workflow 5: Control Your Workspace */}
          <Card className="flex flex-col justify-between overflow-hidden border-border/80 bg-card hover:border-foreground/30 transition-all md:col-span-2 lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <ShieldCheck className="size-5" />
              </div>
              <CardTitle className="mt-4 text-xl">5. Multi-Staff Roles & Control</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Granular role-based access for Workspace Owners, Platform Admins, Teachers, and Reception Staff.
                Each member only sees what they are authorized to manage, backed by strict tenant isolation.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Authentic UI Mini-Mockup */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="rounded-lg border border-border bg-surface-soft p-2.5">
                  <p className="font-semibold text-foreground">Owner</p>
                  <p className="text-[10px] text-muted-foreground">Full Financial & Settings Access</p>
                </div>
                <div className="rounded-lg border border-border bg-surface-soft p-2.5">
                  <p className="font-semibold text-foreground">Teacher</p>
                  <p className="text-[10px] text-muted-foreground">Batches, Attendance & Notes</p>
                </div>
                <div className="rounded-lg border border-border bg-surface-soft p-2.5">
                  <p className="font-semibold text-foreground">Staff</p>
                  <p className="text-[10px] text-muted-foreground">Fee Entry & Student Records</p>
                </div>
                <div className="rounded-lg border border-border bg-surface-soft p-2.5">
                  <p className="font-semibold text-foreground">Platform Admin</p>
                  <p className="text-[10px] text-muted-foreground">Multi-Tenant Governance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PublicContainer>
    </section>
  );
}
