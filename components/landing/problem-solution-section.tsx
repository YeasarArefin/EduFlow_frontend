import { Check, Sparkles } from 'lucide-react';
import { PublicContainer } from '@/components/public/public-container';

const beforeFrictions = [
  {
    title: 'Scattered Student Data',
    desc: 'Profiles split across paper diaries, phone contacts, and unlinked Excel rows.',
  },
  {
    title: 'Manual Fee Reconciliation',
    desc: 'Partial dues, bKash screenshots, and cash slips get lost without automated receipt trails.',
  },
  {
    title: 'Late Absence Detection',
    desc: 'Absence patterns go unnoticed until exam week because attendance sheets stay in folders.',
  },
  {
    title: 'Exhausting Evening Messaging',
    desc: 'Staff spend hours typing repetitive individual text messages to hundreds of parents.',
  },
  {
    title: 'Zero Privacy Boundaries',
    desc: 'Staff and teachers share spreadsheet access, exposing confidential payroll and financials.',
  },
];

const afterSolutions = [
  {
    title: 'Single Source of Truth',
    desc: 'Centralized student directory with guardian contacts, academic history, and batch allocation.',
  },
  {
    title: 'Automated Fee Ledger',
    desc: 'Real-time payment logging, automatic invoice generation, and 1-click digital receipts.',
  },
  {
    title: '1-Click Attendance Roll Calls',
    desc: 'Instant roll-call submission from any phone, flagging low attendance automatically.',
  },
  {
    title: 'Automated Bilingual SMS',
    desc: 'Absence alerts, payment receipts, and exam schedules dispatch immediately to parents.',
  },
  {
    title: 'Role-Based Data Isolation',
    desc: 'Strict permissions ensure teachers and reception staff only see data within their scope.',
  },
];

export function ProblemSolutionSection() {
  return (
    <section className="border-b border-border py-20 sm:py-28 lg:py-32" id="problem-solution">
      <PublicContainer>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.20em] text-accent-foreground">
            The Operational Shift
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            Stop running your coaching center across spreadsheets, notebooks and chat apps.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg font-light leading-relaxed">
            Coaching centers thrive on clear student communication and disciplined operations. Here
            is how EduFlow eliminates administrative friction and restores calm to your daily
            routine.
          </p>
        </div>

        {/* Comparison Cards Grid */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Before Card (Quiet Dark Glass Panel) */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-border bg-card p-6 backdrop-blur-[16px] sm:p-8">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Legacy Routine
                  </span>
                  <h3 className="mt-1 text-xl font-semibold text-foreground font-heading">
                    Fragmented Management
                  </h3>
                </div>
                <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  Manual & Scattered
                </span>
              </div>

              {/* Frictions List */}
              <div className="mt-6 space-y-4">
                {beforeFrictions.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 rounded-xl border border-border bg-card p-3 transition-colors hover:border-border-strong"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-bold text-muted-foreground">
                      ✕
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom State Bar */}
            <div className="mt-6 rounded-xl border border-border bg-muted p-3 text-center">
              <span className="text-xs text-muted-foreground font-light">
                Result: Lost records, delayed fee collections, and evening burnout.
              </span>
            </div>
          </div>

          {/* With EduFlow Card (Emphasized Glass Surface with Lime Light) */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-[rgba(190,242,100,0.25)] bg-gradient-to-b from-[rgba(190,242,100,0.04)] via-white/[0.02] to-transparent p-6 sm:p-8 backdrop-blur-[16px] shadow-[0_0_50px_rgba(190,242,100,0.06)]">
            {/* Ambient Lime Light Orb */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 -right-20 size-48 rounded-full bg-[rgba(190,242,100,0.08)] blur-[40px]"
            />

            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[rgba(190,242,100,0.15)] pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-foreground">
                    The EduFlow System
                  </span>
                  <h3 className="mt-1 text-xl font-semibold text-foreground font-heading">
                    One Synchronized Workspace
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(190,242,100,0.25)] bg-[rgba(190,242,100,0.10)] px-3 py-1 text-xs font-semibold text-accent-foreground">
                  <Sparkles className="size-3 text-accent-foreground" />
                  <span>Automated</span>
                </span>
              </div>

              {/* Solutions List */}
              <div className="mt-6 space-y-4">
                {afterSolutions.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 rounded-xl border border-border bg-card p-3 transition-colors hover:border-accent-border hover:bg-accent/30"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[rgba(190,242,100,0.15)] text-accent-foreground border border-[rgba(190,242,100,0.30)] shadow-[0_0_10px_rgba(190,242,100,0.25)]">
                      <Check className="size-3" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom State Bar */}
            <div className="mt-6 rounded-xl border border-[rgba(190,242,100,0.15)] bg-[rgba(190,242,100,0.03)] p-3 text-center">
              <span className="text-xs text-accent-foreground font-medium">
                Result: 100% attendance visibility, timely fee collections, and relaxed coaching
                days.
              </span>
            </div>
          </div>
        </div>
      </PublicContainer>
    </section>
  );
}
