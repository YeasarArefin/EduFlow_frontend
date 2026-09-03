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
    <section className="border-b border-border py-20 sm:py-28 lg:py-32">
      <PublicContainer>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.20em] text-accent-foreground">
            Unified Ecosystem
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            One connected engine. Zero duplicate data entry.
          </h2>
          <p className="mt-4 text-base font-light text-muted-foreground sm:text-lg">
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
                  <Card className="w-full flex-1 rounded-2xl p-4 shadow-xs transition-all hover:border-accent-border hover:bg-card-strong">
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-mono text-[10px] text-accent-foreground font-semibold">
                        STEP {node.step}
                      </span>
                      <span className="flex size-9 items-center justify-center rounded-xl border border-border-strong bg-muted text-foreground">
                        <Icon className="size-4" />
                      </span>
                      <p className="mt-1 font-heading text-xs font-semibold text-foreground">{node.title}</p>
                      <p className="text-[11px] font-light text-muted-foreground">{node.desc}</p>
                    </div>
                  </Card>

                  {/* Flow Arrow (Mobile: Down, Desktop: Right) */}
                  {index < workflowNodes.length - 1 && (
                    <div className="absolute -right-3 top-1/2 z-10 hidden size-6 -translate-y-1/2 items-center justify-center rounded-full border border-border-strong bg-background text-[10px] text-accent-foreground shadow-sm sm:flex">
                      →
                    </div>
                  )}
                  {index < workflowNodes.length - 1 && (
                    <div className="sm:hidden my-1 flex items-center justify-center text-accent-foreground">
                      <ArrowDown className="size-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Central Convergence Hub Card */}
          <div className="mt-8 rounded-2xl border border-accent-border bg-accent/20 backdrop-blur-md p-6 text-center sm:p-8 shadow-[0_0_50px_var(--glow-lime)]">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_var(--glow-lime)]">
              <Layers className="size-6" />
            </div>
            <h3 className="mt-4 font-heading text-xl font-semibold text-foreground sm:text-2xl">
              EduFlow Central Workspace
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-xs font-light text-muted-foreground sm:text-sm">
              All records stay synchronized in real time. Attendance updates calculate student engagement,
              fee receipts credit the general ledger, and staff actions are tracked in the workspace audit log.
            </p>
          </div>
        </div>
      </PublicContainer>
    </section>
  );
}
