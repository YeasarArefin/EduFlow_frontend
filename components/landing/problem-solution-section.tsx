import { Check, X } from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const beforePoints = [
  "Student profiles scattered across physical notebooks, phone contacts, and loose forms",
  "Manual fee tallying in spreadsheets where partial dues and bKash slips get lost",
  "Paper attendance registers where absence trends go unnoticed until exam week",
  "Copy-pasting repetitive SMS messages to hundreds of parents every evening",
  "Shared passwords and zero visibility into which staff member edited what",
];

const afterPoints = [
  "One centralized workspace connecting student records, batches, and guardian contacts",
  "Automated fee ledger with instant digital receipts and clear monthly dues tracking",
  "1-click batch attendance with automatic low-attendance alerts for teachers and parents",
  "Automated bilingual SMS notifications dispatched immediately on attendance & fees",
  "Role-based permissions (Owner, Teacher, Staff) keeping sensitive data secure",
];

export function ProblemSolutionSection() {
  return (
    <section className="border-b border-border/80 py-20 sm:py-28 lg:py-32" id="how-it-works">
      <PublicContainer>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            The Operational Shift
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Stop managing your coaching center across spreadsheets and notebooks.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Coaching centers thrive on clear student communication and disciplined operations.
            Here is how EduFlow eliminates administrative chaos.
          </p>
        </div>

        {/* Comparison Cards Grid */}
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Before Card */}
          <Card className="border-rose-500/20 bg-rose-500/[0.02] dark:border-rose-500/10 dark:bg-rose-950/[0.05]">
            <CardHeader className="border-b border-rose-500/10 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-rose-600 dark:text-rose-400">
                  Before EduFlow
                </CardTitle>
                <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                  Scattered & Manual
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Juggling disconnected tools, paper slips, and endless evening admin work.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {beforePoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      <X className="size-3" />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* With EduFlow Card */}
          <Card className="border-emerald-500/30 bg-emerald-500/[0.02] dark:border-emerald-500/20 dark:bg-emerald-950/[0.05] shadow-md">
            <CardHeader className="border-b border-emerald-500/20 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  With EduFlow
                </CardTitle>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Unified & Automated
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Everything in one calm workspace with automated receipts and instant guardian alerts.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {afterPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <Check className="size-3" />
                    </span>
                    <span className="font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </PublicContainer>
    </section>
  );
}
