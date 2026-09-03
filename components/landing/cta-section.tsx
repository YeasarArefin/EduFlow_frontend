import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import { Button } from "@/components/ui/button";
import { AmbientGlow } from "./ambient-glow";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 lg:py-36 bg-background text-foreground border-b border-border">
      <AmbientGlow position="center" withGrid={true} />

      <PublicContainer className="relative z-10 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-accent-border bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground backdrop-blur-md mb-6">
          <Sparkles className="size-3.5 text-accent-foreground" />
          <span>Ready to upgrade your coaching operations?</span>
        </div>

        <h2 className="mx-auto max-w-3xl font-heading text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
          Your coaching center deserves better than spreadsheets.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg sm:leading-8 font-light">
          Bring your students, fees, attendance, schedules and team into one organized workspace.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            variant="default"
            className="w-full sm:w-auto rounded-full px-8 font-semibold shadow-[0_0_25px_rgba(190,242,100,0.3)] hover:shadow-[0_0_35px_rgba(190,242,100,0.5)] transition-all cursor-pointer"
            render={<Link href="/signup" />}
          >
            <span>Get Started</span>
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>

          <Button
            size="lg"
            variant="glass"
            className="w-full sm:w-auto rounded-full px-7 text-muted-foreground hover:text-foreground cursor-pointer"
            render={<Link href="/pricing" />}
          >
            <span>View Pricing</span>
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground/70 font-light">
          No credit card required · Instant setup in under 2 minutes
        </p>
      </PublicContainer>
    </section>
  );
}
