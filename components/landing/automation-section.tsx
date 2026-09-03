import {
  BellRing,
  CheckCircle2,
  CreditCard,
  FileCheck,
  Send,
  UserX,
  Zap,
} from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AutomationSection() {
  return (
    <section className="border-b border-border bg-background-subtle py-20 sm:py-28 lg:py-32">
      <PublicContainer>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-accent-border bg-accent px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            <Zap className="size-3 text-accent-foreground" />
            <span>Built-In Automation</span>
          </div>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            Less repetitive work. More time teaching.
          </h2>
          <p className="mt-4 text-base font-light text-muted-foreground sm:text-lg">
            EduFlow runs routine operations in the background so you never have to spend evenings manually
            crafting SMS alerts or reconciling receipts.
          </p>
        </div>

        {/* 2 Automation Pipelines */}
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Pipeline 1: Tuition Collection & Instant Receipt */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 font-heading text-base font-semibold text-foreground">
                  <CreditCard className="size-4 text-accent-foreground" />
                  <span>Fee Collection Pipeline</span>
                </CardTitle>
                <span className="rounded-full bg-accent border border-accent-border px-2.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
                  Fully Automated
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {[
                { step: "01", title: "Tuition Payment Logged", desc: "Front desk records ৳3,000 cash or bKash TrxID", icon: CreditCard },
                { step: "02", title: "Digital Receipt Generated", desc: "Branded PDF & receipt number (#EF-8942) created", icon: FileCheck },
                { step: "03", title: "Student Ledger Updated", desc: "Balance reconciled to ৳0 with updated batch dues", icon: CheckCircle2 },
                { step: "04", title: "Parent SMS Dispatched", desc: "Guardian receives immediate confirmation SMS", icon: Send },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="flex items-start gap-3.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-muted text-accent-foreground">
                      <Icon className="size-4" />
                    </span>
                    <div className="flex-1 rounded-xl border border-border bg-card p-3">
                      <p className="font-heading text-xs font-semibold text-foreground">{item.title}</p>
                      <p className="mt-0.5 text-[11px] font-light text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Pipeline 2: Attendance & Absence Alert */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 font-heading text-base font-semibold text-foreground">
                  <BellRing className="size-4 text-accent-foreground" />
                  <span>Absence Notification Pipeline</span>
                </CardTitle>
                <span className="rounded-full bg-accent border border-accent-border px-2.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
                  Real-Time Trigger
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {[
                { step: "01", title: "Student Marked Absent", desc: "Teacher checks roll in class with 1 click", icon: UserX },
                { step: "02", title: "Batch Attendance Finalized", desc: "System locks daily session log and counts", icon: FileCheck },
                { step: "03", title: "Absence Threshold Evaluated", desc: "Checks if student falls below 80% monthly attendance", icon: CheckCircle2 },
                { step: "04", title: "Guardian Alert Sent", desc: "Bilingual SMS notice delivered to guardian's phone", icon: Send },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-muted font-mono text-xs font-semibold text-accent-foreground">
                    {item.step}
                  </span>
                  <div className="flex-1 rounded-xl border border-border bg-card p-3">
                    <p className="font-heading text-xs font-semibold text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-[11px] font-light text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </PublicContainer>
    </section>
  );
}
