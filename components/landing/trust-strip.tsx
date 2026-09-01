import { PublicContainer } from "@/components/public/public-container";

const capabilities = [
  "Students",
  "Batches",
  "Fee Receipts",
  "Daily Attendance",
  "Schedules",
  "SMS Alerts",
  "Guardian Notices",
  "Multi-Staff Access",
];

export function TrustStrip() {
  return (
    <section className="border-b border-border/80 bg-surface-soft/50 py-6" aria-label="Core operational scope">
      <PublicContainer className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Built for the everyday operations of modern coaching centers
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
          {capabilities.map((cap) => (
            <span
              key={cap}
              className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {cap}
            </span>
          ))}
        </div>
      </PublicContainer>
    </section>
  );
}
