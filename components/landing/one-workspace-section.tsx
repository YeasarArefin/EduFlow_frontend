import {
  ArrowDown,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Layers,
  MessageSquare,
  Users,
} from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import { Card } from "@/components/ui/card";

const workflowNodes = [
  {
    step: "01",
    title: "Student Enrollment",
    desc: "Learner profiles & guardians",
    icon: Users,
  },
  {
    step: "02",
    title: "Batch & Room Scheduling",
    desc: "Class timetables & capacities",
    icon: CalendarDays,
  },
  {
    step: "03",
    title: "Daily Attendance Check-in",
    desc: "1-click presence recording",
    icon: CheckCircle2,
  },
  {
    step: "04",
    title: "Tuition & Fee Ledger",
    desc: "Automated billing & receipts",
    icon: CreditCard,
  },
  {
    step: "05",
    title: "Instant Guardian SMS",
    desc: "Alerts & payment confirmations",
    icon: MessageSquare,
  },
];

export function OneWorkspaceSection() {
  return (
    <section className="border-b border-border/80 py-20 sm:py-28 lg:py-32">
      <PublicContainer>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Unified Ecosystem
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            One connected engine. Zero duplicate data entry.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            When a student enrolls, their profile connects directly to their batch, attendance record,
            monthly fee ledger, and parent communication channel.
          </p>
        </div>

        {/* Visual Workflow Convergence Composition */}
        <div className="mt-16 mx-auto max-w-4xl">
          {/* Workflow Chain */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            {workflowNodes.map((node, index) => {
              const Icon = node.icon;
              return (
                <div key={node.step} className="relative flex flex-col items-center text-center">
                  <Card className="w-full flex-1 border-border/80 bg-card p-4 transition-all hover:border-foreground/40 shadow-xs">
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground font-semibold">
                        STEP {node.step}
                      </span>
                      <span className="flex size-9 items-center justify-center rounded-full bg-surface-soft border border-border text-foreground">
                        <Icon className="size-4" />
                      </span>
                      <p className="text-xs font-semibold text-foreground mt-1">{node.title}</p>
                      <p className="text-[11px] text-muted-foreground">{node.desc}</p>
                    </div>
                  </Card>

                  {/* Flow Arrow (Mobile: Down, Desktop: Right) */}
                  {index < workflowNodes.length - 1 && (
                    <div className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 size-6 items-center justify-center rounded-full bg-surface-soft border border-border text-muted-foreground text-[10px]">
                      →
                    </div>
                  )}
                  {index < workflowNodes.length - 1 && (
                    <div className="sm:hidden my-1 flex items-center justify-center text-muted-foreground">
                      <ArrowDown className="size-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Central Convergence Hub Card */}
          <div className="mt-8 rounded-2xl border-2 border-foreground/20 bg-foreground/[0.02] dark:bg-foreground/[0.04] p-6 text-center sm:p-8">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
              <Layers className="size-6" />
            </div>
            <h3 className="mt-4 font-heading text-xl font-semibold text-foreground sm:text-2xl">
              EduFlow Central Workspace
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-xs text-muted-foreground sm:text-sm">
              All records stay synchronized in real time. Attendance updates calculate student engagement,
              fee receipts credit the general ledger, and staff actions are tracked in the workspace audit log.
            </p>
          </div>
        </div>
      </PublicContainer>
    </section>
  );
}
