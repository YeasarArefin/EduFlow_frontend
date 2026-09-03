"use client";

import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  MessageSquare,
  Users,
} from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import { Card, CardContent } from "@/components/ui/card";

interface ShowcaseItem {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: typeof Users;
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: "students",
    label: "Students",
    title: "Centralized Student Profiles & Enrolment Records",
    description:
      "Maintain a unified directory with guardian phone numbers, custom enrollment tags, emergency contacts, and complete batch history.",
    icon: Users,
  },
  {
    id: "batches",
    label: "Batches",
    title: "Structured Batch & Schedule Management",
    description:
      "Configure recurring class timetables, assign instructors, manage room capacities, and handle transfers seamlessly.",
    icon: Calendar,
  },
  {
    id: "fees",
    label: "Fees & Dues",
    title: "Automated Monthly Billing & Instant Receipts",
    description:
      "Generate monthly fee invoices, track pending dues by batch, support partial installments, and issue branded digital receipts.",
    icon: CreditCard,
  },
  {
    id: "attendance",
    label: "Attendance",
    title: "1-Click Batch Attendance & Low Attendance Flags",
    description:
      "Mark attendance on mobile or desktop in seconds. Automatically detect students below the 80% threshold and alert guardians.",
    icon: CheckCircle2,
  },
  {
    id: "communication",
    label: "SMS & Notices",
    title: "Automated Guardian Communications & Notices",
    description:
      "Dispatch automated bilingual SMS notifications for attendance check-ins, fee payment receipts, exam schedules, and holiday announcements.",
    icon: MessageSquare,
  },
];

export function InteractiveFeatureShowcase() {
  const [activeId, setActiveId] = useState<string>("fees");
  const activeItem = showcaseItems.find((item) => item.id === activeId) || showcaseItems[0];

  return (
    <section className="border-b border-border bg-background-subtle py-20 sm:py-28 lg:py-32">
      <PublicContainer>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.20em] text-accent-foreground">
            Interactive Product Tour
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            See how each workflow fits into your daily routine.
          </h2>
          <p className="mt-4 text-base font-light text-muted-foreground sm:text-lg">
            Switch between modules to preview the exact interface you and your coaching staff will use every day.
          </p>
        </div>

        {/* Split Showcase Layout */}
        <div className="mt-16 grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Vertical Navigation (5 cols) */}
          <div className="flex flex-col gap-2.5 lg:col-span-5">
            {showcaseItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={`group flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "border-accent-border bg-accent/40 shadow-[0_0_25px_var(--glow-lime)] scale-[1.01]"
                      : "border-transparent bg-transparent hover:border-border hover:bg-muted"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-[0_0_10px_var(--glow-lime)]"
                        : "border-border-strong bg-card text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-heading text-sm font-semibold ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                        {item.label}
                      </p>
                      {isActive && <ChevronRight className="size-4 text-accent-foreground" />}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs font-light text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Dynamic Visualization Card (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="overflow-hidden rounded-2xl shadow-[var(--shadow-elevated)] backdrop-blur-[20px]">
              {/* Card Window Topbar */}
              <div className="flex items-center justify-between border-b border-border bg-muted px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary shadow-[0_0_6px_var(--glow-lime)]" />
                  <span className="font-heading text-xs font-semibold text-foreground">
                    {activeItem.title}
                  </span>
                </div>
                <span className="rounded-full border border-border-strong bg-card px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  Module View
                </span>
              </div>

              {/* Dynamic View Mockup */}
              <CardContent className="p-6">
                {activeId === "students" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="text-xs font-semibold text-foreground">Enrolled Students Directory</span>
                      <span className="text-[11px] font-mono text-muted-foreground">Showing 184 Learners</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {[
                        { name: "Tanvir Hasan", roll: "PH-104", guardian: "+880 1712-345678", batch: "HSC 2026 Batch A", status: "Active" },
                        { name: "Samiya Rahman", roll: "PH-108", guardian: "+880 1819-234567", batch: "Medical Prep 2026", status: "Active" },
                        { name: "Nabil Chowdhury", roll: "PH-112", guardian: "+880 1911-876543", batch: "Engineering Special", status: "Active" },
                      ].map((st) => (
                        <div key={st.roll} className="flex items-center justify-between rounded-lg border border-border bg-surface-soft p-3">
                          <div>
                            <p className="font-semibold text-foreground">{st.name}</p>
                            <p className="text-[11px] text-muted-foreground">Guardian: {st.guardian}</p>
                          </div>
                          <div className="text-right">
                            <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono">{st.roll}</span>
                            <p className="text-[10px] text-muted-foreground mt-1">{st.batch}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeId === "batches" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="text-xs font-semibold text-foreground">Active Batch Schedules</span>
                      <span className="text-[11px] font-mono text-muted-foreground">6 Batches Running</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {[
                        { name: "HSC Physics 2026 Batch A", days: "Sun / Tue / Thu", time: "10:00 AM - 11:30 AM", room: "Room 301", students: 30 },
                        { name: "Medical Biology Intensive", days: "Mon / Wed / Sat", time: "04:00 PM - 05:30 PM", room: "Room 204", students: 28 },
                        { name: "Engineering Math Special", days: "Fri / Sat", time: "08:30 AM - 10:30 AM", room: "Room 102", students: 25 },
                      ].map((batch) => (
                        <div key={batch.name} className="flex items-center justify-between rounded-lg border border-border bg-surface-soft p-3">
                          <div>
                            <p className="font-semibold text-foreground">{batch.name}</p>
                            <p className="text-[11px] text-muted-foreground">{batch.days} • {batch.time}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-foreground">{batch.students} Students</span>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{batch.room}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeId === "fees" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <span className="text-xs font-semibold text-foreground">Tuition Fee Ledger</span>
                        <p className="text-[11px] text-muted-foreground">August 2026 Billing Period</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">৳1,42,500 Collected</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {[
                        { id: "#EF-8942", student: "Tanvir Hasan", amount: "৳3,000", method: "bKash Verified", status: "Paid" },
                        { id: "#EF-8941", student: "Samiya Rahman", amount: "৳3,000", method: "Cash Desk", status: "Paid" },
                        { id: "#EF-8940", student: "Nabil Chowdhury", amount: "৳1,500 Due", method: "Reminder Sent", status: "Due" },
                      ].map((fee) => (
                        <div key={fee.id} className="flex items-center justify-between rounded-lg border border-border bg-surface-soft p-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] text-muted-foreground">{fee.id}</span>
                            <div>
                              <p className="font-semibold text-foreground">{fee.student}</p>
                              <p className="text-[10px] text-muted-foreground">{fee.method}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-mono font-semibold ${fee.status === "Paid" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                              {fee.amount}
                            </p>
                            <span className="rounded-full bg-surface-card border px-2 py-0.5 text-[9px] font-medium mt-1 inline-block">
                              Receipt Generated
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeId === "attendance" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <span className="text-xs font-semibold text-foreground">Batch Attendance Tracker</span>
                        <p className="text-[11px] text-muted-foreground">Physics HSC Batch A — 12 August</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        94.2% Attendance Rate
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {[
                        { name: "Tanvir Hasan", roll: "PH-104", status: "Present", time: "10:32 AM", note: "Checked In" },
                        { name: "Samiya Rahman", roll: "PH-108", status: "Present", time: "10:35 AM", note: "Checked In" },
                        { name: "Nabil Chowdhury", roll: "PH-112", status: "Absent", time: "10:40 AM", note: "Parent SMS Sent" },
                      ].map((att) => (
                        <div key={att.roll} className="flex items-center justify-between rounded-lg border border-border bg-surface-soft p-3">
                          <div className="flex items-center gap-2.5">
                            <span className={`flex size-2 rounded-full ${att.status === "Present" ? "bg-emerald-500" : "bg-rose-500"}`} />
                            <div>
                              <p className="font-semibold text-foreground">{att.name}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">{att.roll}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${att.status === "Present" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"}`}>
                              {att.status}
                            </span>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{att.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeId === "communication" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <span className="text-xs font-semibold text-foreground">SMS Dispatch Log</span>
                        <p className="text-[11px] text-muted-foreground">Automated Parent Gateways</p>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">Wallet: 1,840 SMS Left</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {[
                        { title: "Tuition Receipt SMS", to: "+880 1712-345678", preview: "EduFlow: Received ৳3,000 for Tanvir Hasan (August). Receipt #EF-8942.", status: "Delivered" },
                        { title: "Daily Absence Notification", to: "+880 1911-876543", preview: "EduFlow: Nabil Chowdhury was absent from Physics Batch A today.", status: "Delivered" },
                        { title: "Exam Schedule Broadcast", to: "Batch HSC 2026 (30 Parents)", preview: "EduFlow: Physics Mock Test 2 is scheduled for Friday at 9:00 AM.", status: "Queued" },
                      ].map((msg, i) => (
                        <div key={i} className="rounded-lg border border-border bg-surface-soft p-3">
                          <div className="flex items-center justify-between pb-1 border-b border-border/60">
                            <span className="font-semibold text-foreground">{msg.title}</span>
                            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{msg.status}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1 font-mono">{msg.to}</p>
                          <p className="text-xs text-foreground/90 mt-1 italic">&quot;{msg.preview}&quot;</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </PublicContainer>
    </section>
  );
}
