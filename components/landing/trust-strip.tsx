import { PublicContainer } from "@/components/public/public-container";

const capabilities = [
  "Students",
  "Attendance",
  "Fees",
  "Teachers",
  "Batches",
  "Communication",
  "Schedules",
];

export function TrustStrip() {
  return (
    <section className="border-b border-border bg-background-subtle py-6" aria-label="Core operational scope">
      <PublicContainer className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <p className="text-[11px] font-bold uppercase tracking-[0.20em] text-muted-foreground">
          Everything your coaching center needs. <span className="text-accent-foreground">One workspace.</span>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
          {capabilities.map((cap) => (
            <span
              key={cap}
              className="inline-flex items-center rounded-full border border-border bg-card px-3.5 py-1 text-xs font-medium text-foreground-soft backdrop-blur-md"
            >
              {cap}
            </span>
          ))}
        </div>
      </PublicContainer>
    </section>
  );
}
