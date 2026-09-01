import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import { Button } from "@/components/ui/button";
import { AmbientGlow } from "./ambient-glow";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 lg:py-36 bg-foreground text-background">
      <AmbientGlow position="center" />

      <PublicContainer className="relative z-10 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-background/90 backdrop-blur-xs mb-6">
          <Sparkles className="size-3.5" />
          <span>Ready to upgrade your coaching operations?</span>
        </div>

        <h2 className="mx-auto max-w-3xl font-heading text-3xl font-bold tracking-tight text-background sm:text-5xl lg:text-6xl">
          Bring your entire coaching center into one workspace.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base text-background/80 sm:text-lg sm:leading-8">
          Manage students, batches, fee receipts, attendance, and guardian notifications without
          juggling multiple systems or losing hours to evening admin work.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto rounded-full px-8 font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
            render={<Link href="/signup" />}
          >
            <span>Start Free 14-Day Trial</span>
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto rounded-full px-7 border-background/30 text-background hover:bg-background/10 cursor-pointer"
            render={<Link href="/features" />}
          >
            <span>Explore All Features</span>
          </Button>
        </div>

        <p className="mt-6 text-xs text-background/60">
          No credit card required · Setup takes less than 2 minutes
        </p>
      </PublicContainer>
    </section>
  );
}
