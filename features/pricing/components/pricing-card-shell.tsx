import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { PricingCardShellProps } from '@/types/pricing';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export function PricingCardShell({
  name,
  badge,
  desc,
  priceDisplay,
  periodDisplay,
  features,
  isPopular,
  ctaHref,
  ctaLabel,
}: PricingCardShellProps) {
  return (
    <Card
      data-premium-tilt
      className={`relative flex flex-col justify-between rounded-2xl transition-all duration-300 ${
        isPopular
          ? 'border-accent-border bg-gradient-to-b from-accent/30 to-transparent backdrop-blur-md shadow-[0_0_40px_rgba(190,242,100,0.12)] scale-[1.02]'
          : 'border-border bg-card backdrop-blur-md shadow-xs hover:border-border-strong'
      }`}
    >
      <CardHeader className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="font-heading text-xl font-bold text-foreground">{name}</CardTitle>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
              isPopular
                ? 'bg-primary text-primary-foreground shadow-[0_0_10px_var(--glow-lime)]'
                : 'border border-border bg-muted text-muted-foreground'
            }`}
          >
            {badge}
          </span>
        </div>
        <CardDescription className="mt-2 text-xs font-light leading-relaxed text-muted-foreground">
          {desc}
        </CardDescription>
        <div className="mt-4 flex items-baseline gap-1.5 border-t border-border pt-4">
          <span className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {priceDisplay}
          </span>
          <span className="text-xs font-light text-muted-foreground">{periodDisplay}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-6 pb-6 sm:px-8">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-accent-foreground">
          What&apos;s included
        </p>
        <ul className="space-y-2.5">
          {features.map((feature) => (
            <li key={feature.key} className="flex items-start gap-2 text-xs">
              <Check className="mt-0.5 size-3.5 shrink-0 text-accent-foreground" />
              <span>
                <span className="text-foreground-soft">{feature.label}</span>
                {feature.limit != null && (
                  <span className="text-muted-foreground"> · up to {feature.limit}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="p-6 pb-8 pt-0 sm:px-8">
        <Button
          size="lg"
          className={`min-h-11 w-full cursor-pointer rounded-full font-semibold ${
            isPopular ? 'shadow-[0_0_20px_rgba(190,242,100,0.25)]' : ''
          }`}
          variant={isPopular ? 'default' : 'glass'}
          render={<Link href={ctaHref} />}
        >
          <span>{ctaLabel}</span>
          <ArrowRight className="size-4" data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  );
}
