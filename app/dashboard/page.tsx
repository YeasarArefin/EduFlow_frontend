import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CreditCard,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard-primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Coaching Overview"
        description="Monitor daily attendance, students, batches, and collection records."
        actions={
          <Button
            size="sm"
            className="rounded-full gap-1.5"
            render={<Link href="/dashboard/students" />}
          >
            <UserPlus className="size-3.5" data-icon="inline-start" />
            <span>Add Student</span>
          </Button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value="0" detail="Enrolled active learners" />
        <StatCard label="Active Batches" value="0" detail="Running schedules" />
        <StatCard label="Today's Attendance" value="0%" detail="Check-ins recorded" />
        <StatCard label="Fee Collections" value="৳0" detail="Current month total" />
      </div>

      {/* Operations & Setup Modules */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Welcome / Quick Start Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Getting Started with Your Workspace</CardTitle>
            <CardDescription>
              Your coaching workspace is active. Complete these initial steps to start managing your daily operations.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/dashboard/students"
                className="group flex flex-col justify-between rounded-lg border border-border bg-surface-soft p-4 transition-all hover:border-foreground/20 hover:bg-muted/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Users className="size-4" />
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-foreground">Students Directory</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Add student profiles, guardian contacts, and roll numbers.</p>
                </div>
              </Link>

              <Link
                href="/dashboard/attendance"
                className="group flex flex-col justify-between rounded-lg border border-border bg-surface-soft p-4 transition-all hover:border-foreground/20 hover:bg-muted/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CalendarCheck className="size-4" />
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-foreground">Daily Attendance</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Log attendance per batch and notify guardians instantly.</p>
                </div>
              </Link>

              <Link
                href="/dashboard/payments"
                className="group flex flex-col justify-between rounded-lg border border-border bg-surface-soft p-4 transition-all hover:border-foreground/20 hover:bg-muted/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CreditCard className="size-4" />
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-foreground">Fee Management</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Generate monthly invoices and record tuition receipts.</p>
                </div>
              </Link>

              <Link
                href="/dashboard/settings"
                className="group flex flex-col justify-between rounded-lg border border-border bg-surface-soft p-4 transition-all hover:border-foreground/20 hover:bg-muted/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Settings className="size-4" />
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-foreground">Workspace Settings</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Configure receipt prefix, fee due dates, and language.</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info / Coaching Status Card */}
        <SectionCard title="Workspace Status">
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Subscription</span>
              <span className="font-medium text-foreground">Active</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Language</span>
              <span className="font-medium text-foreground">Bangla / English</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">SMS Alerts</span>
              <span className="font-medium text-foreground">Configured</span>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-full"
                render={<Link href="/dashboard/settings" />}
              >
                Manage Workspace
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

