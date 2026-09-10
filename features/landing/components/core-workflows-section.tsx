import {
  Calendar,
  CalendarCheck,
  CreditCard,
  GraduationCap,
  MessageSquare,
  Users,
} from 'lucide-react';
import { PublicContainer } from '@/components/public/public-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function CoreWorkflowsSection() {
  return (
    <section className="border-b border-border py-20 sm:py-28 lg:py-32" id="features">
      <PublicContainer>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.20em] text-accent-foreground">
            Core Modules
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            Everything engineered for your daily coaching operations.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg font-light">
            Every module in EduFlow works seamlessly together—sharing the same student directory,
            batch rosters, fee ledgers, and automated communication channels.
          </p>
        </div>

        {/* 6-Module Bento Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* 1. Student Management (Span 2 on large screens for bento prominence) */}
          <Card
            data-premium-tilt
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card hover:border-accent-border hover:bg-accent/30 backdrop-blur-md transition-all lg:col-span-2"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-muted text-accent-foreground">
                  <Users className="size-5" />
                </div>
                <span className="rounded-full bg-muted border border-border px-3 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Directory &amp; History
                </span>
              </div>
              <CardTitle className="mt-4 text-xl font-semibold text-foreground font-heading">
                Student Management
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground font-light leading-relaxed max-w-xl">
                Search, organize and track students, guardian information and enrollment history
                with full academic profiles and batch allocations.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Authentic UI Visualization — intentionally product-dark */}
              <div className="rounded-xl border border-border bg-muted p-4 text-xs">
                <div className="flex flex-col justify-between gap-2 border-b border-border pb-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      TH
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">Tanvir Hasan</p>
                      <p className="text-[11px] text-muted-foreground">
                        Roll #104 · Enrolled Jan 2026
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-muted border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                      HSC Physics
                    </span>
                    <span className="rounded-md bg-accent border border-accent-border px-2 py-0.5 text-[11px] text-accent-foreground font-medium">
                      Active
                    </span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-muted-foreground font-light">
                  <div>
                    <span className="text-muted-foreground/60 block text-[10px] uppercase tracking-wider">
                      Guardian
                    </span>
                    <span className="text-foreground font-medium">
                      Md. Hasan (+880 1712-345678)
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground/60 block text-[10px] uppercase tracking-wider">
                      Batches
                    </span>
                    <span className="text-foreground font-medium">Batch Alpha (Mon/Wed)</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground/60 block text-[10px] uppercase tracking-wider">
                      Attendance Rate
                    </span>
                    <span className="text-accent-foreground font-semibold">96.4%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Attendance */}
          <Card
            data-premium-tilt
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card hover:border-accent-border hover:bg-accent/30 backdrop-blur-md transition-all"
          >
            <CardHeader className="pb-4">
              <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-muted text-accent-foreground">
                <CalendarCheck className="size-5" />
              </div>
              <CardTitle className="mt-4 text-xl font-semibold text-foreground font-heading">
                Attendance
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground font-light leading-relaxed">
                Record class attendance and quickly identify attendance issues with 1-click batch
                roll calls.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-xl border border-border bg-muted/50 p-3 text-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-medium text-foreground">Batch Alpha · Today</span>
                  <span className="text-[10px] font-semibold text-accent-foreground">
                    26/28 Present (93%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Ayesha Rahman</span>
                  <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium">
                    Present
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Rafiqul Islam</span>
                  <span className="rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 text-[10px] font-medium">
                    Absent (SMS Sent)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Fee Management (Span 2 on large screens for prominent financial ledger) */}
          <Card
            data-premium-tilt
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card hover:border-accent-border hover:bg-accent/30 backdrop-blur-md transition-all lg:col-span-2"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-muted text-accent-foreground">
                  <CreditCard className="size-5" />
                </div>
                <span className="rounded-full bg-muted border border-border px-3 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Ledger &amp; Receipts
                </span>
              </div>
              <CardTitle className="mt-4 text-xl font-semibold text-foreground font-heading">
                Fee Management
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground font-light leading-relaxed max-w-xl">
                Track monthly fees, collected amounts, outstanding dues and payment history with
                automated digital receipts and bKash transaction logging.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-xl border border-border bg-muted/50 p-4 text-xs">
                <div className="grid grid-cols-3 gap-2 border-b border-border pb-3 text-center">
                  <div>
                    <span className="text-muted-foreground/60 text-[10px] uppercase tracking-wider block">
                      Collected (This Month)
                    </span>
                    <span className="font-heading text-lg font-semibold text-foreground">
                      ৳385,000
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground/60 text-[10px] uppercase tracking-wider block">
                      Outstanding Dues
                    </span>
                    <span className="font-heading text-lg font-semibold text-rose-400">
                      ৳32,500
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground/60 text-[10px] uppercase tracking-wider block">
                      Collection Rate
                    </span>
                    <span className="font-heading text-lg font-semibold text-accent-foreground">
                      92.2%
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-primary" />
                    <span>Receipt #INV-2026-089 issued to Farhana Akter (৳3,500)</span>
                  </div>
                  <span className="text-muted-foreground/60">2 mins ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Batch & Schedule Management */}
          <Card
            data-premium-tilt
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card hover:border-accent-border hover:bg-accent/30 backdrop-blur-md transition-all"
          >
            <CardHeader className="pb-4">
              <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-muted text-accent-foreground">
                <Calendar className="size-5" />
              </div>
              <CardTitle className="mt-4 text-xl font-semibold text-foreground font-heading">
                Batch &amp; Schedule
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground font-light leading-relaxed">
                Organize batches, teachers, rooms and recurring class schedules without
                double-booking rooms.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-xl border border-border bg-muted/50 p-3 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Batch Gamma · HSC Math</span>
                  <span className="rounded-full bg-muted border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                    Room 302
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Sun / Tue / Thu • 5:00 PM</span>
                  <span className="text-accent-foreground font-medium">32 Students</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Teacher Management */}
          <Card
            data-premium-tilt
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card hover:border-accent-border hover:bg-accent/30 backdrop-blur-md transition-all"
          >
            <CardHeader className="pb-4">
              <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-muted text-accent-foreground">
                <GraduationCap className="size-5" />
              </div>
              <CardTitle className="mt-4 text-xl font-semibold text-foreground font-heading">
                Teacher Management
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground font-light leading-relaxed">
                Manage teachers, assignments and relevant operational information with designated
                batch access.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-xl border border-border bg-muted/50 p-3 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground border border-border">
                      SZ
                    </span>
                    <span className="font-semibold text-foreground">Dr. Salman Zaheer</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Senior Faculty</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span>Assigned: 3 Batches (84 Students)</span>
                  <span className="text-accent-foreground">Teacher Role</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 6. Communication */}
          <Card
            data-premium-tilt
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card hover:border-accent-border hover:bg-accent/30 backdrop-blur-md transition-all lg:col-span-2"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-muted text-accent-foreground">
                  <MessageSquare className="size-5" />
                </div>
                <span className="rounded-full bg-muted border border-border px-3 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Bilingual SMS &amp; Notices
                </span>
              </div>
              <CardTitle className="mt-4 text-xl font-semibold text-foreground font-heading">
                Communication
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground font-light leading-relaxed max-w-xl">
                Send notices, SMS/email messages and important reminders to guardians and students
                with dynamic templates and instant delivery status.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-xl border border-border bg-muted/50 p-4 text-xs">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary shadow-[0_0_6px_rgba(190,242,100,0.8)]" />
                    <span className="font-semibold text-foreground">
                      Guardian SMS Broadcast · Batch Alpha
                    </span>
                  </div>
                  <span className="rounded-full bg-accent text-accent-foreground border border-accent-border px-2 py-0.5 text-[10px] font-medium">
                    Delivered (28/28)
                  </span>
                </div>
                <p className="mt-2.5 text-muted-foreground font-mono text-[11px] leading-relaxed bg-muted p-2.5 rounded-lg border border-border">
                  &ldquo;Dear Parent, Exam schedule for HSC Physics Batch Alpha is published. Class
                  test will be held on Thursday at 4:30 PM. - EduFlow Apex Center&rdquo;
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PublicContainer>
    </section>
  );
}
