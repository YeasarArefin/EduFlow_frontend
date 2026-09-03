import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PublicPlan } from "@/features/pricing/api/get-public-plans";

/* ─── helpers ─────────────────────────────────────────────────── */

export function formatBdt(priceMinor: string) {
  const normalized = priceMinor.replace(/^0+(?=\d)/, "");
  const whole = normalized.length > 2 ? normalized.slice(0, -2) : "0";
  const poisha = normalized.slice(-2).padStart(2, "0");
  return `৳${whole}.${poisha}`;
}

export function durationLabel(days: number) {
  if (days === 365) return "year";
  if (days === 30) return "month";
  return `${days} days`;
}

/* ─── static tier shape ───────────────────────────────────────── */

export interface StaticTier {
  name: string;
  badge: string;
  price: string;
  period: string;
  desc: string;
  highlight?: boolean;
  features: string[];
}

export const STATIC_TIERS: StaticTier[] = [
  {
    name: "Starter",
    badge: "14-Day Free Trial",
    price: "৳1,500",
    period: "per month",
    desc: "Ideal for individual tutors and private batch instructors.",
    highlight: false,
    features: [
      "Up to 50 Active Students",
      "Up to 4 Batches",
      "1 Staff Seat (Owner)",
      "Daily Attendance & Reports",
      "500 Free SMS / month",
      "Email & Community Support",
    ],
  },
  {
    name: "Standard",
    badge: "Most Popular",
    price: "৳3,500",
    period: "per month",
    desc: "For growing coaching centers with multiple instructors.",
    highlight: true,
    features: [
      "Up to 200 Active Students",
      "Unlimited Batches & Schedules",
      "5 Staff & Teacher Seats",
      "Automated Fee Receipts & Dues",
      "2,000 Free SMS / month",
      "Bilingual Parent SMS Templates",
      "Priority WhatsApp Support",
    ],
  },
  {
    name: "Pro",
    badge: "Maximum Scale",
    price: "৳7,000",
    period: "per month",
    desc: "For established institutes needing full operational automation.",
    highlight: false,
    features: [
      "Unlimited Students",
      "Unlimited Batches & Branches",
      "Unlimited Staff & Instructors",
      "Advanced Fee & Salary Payroll",
      "5,000 Free SMS / month",
      "Custom SMS Sender ID",
      "Dedicated Account Manager",
    ],
  },
];

/* ─── shared card shell ───────────────────────────────────────── */

function PricingCardShell({
  name,
  badge,
  desc,
  priceDisplay,
  periodDisplay,
  features,
  isPopular,
  ctaHref,
  ctaLabel,
}: {
  name: string;
  badge: string;
  desc: string;
  priceDisplay: string;
  periodDisplay: string;
  features: Array<{ key: string; label: string; limit?: string | null }>;
  isPopular: boolean;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <Card
      data-premium-tilt
      className={`relative flex flex-col justify-between rounded-2xl transition-all duration-300 ${
        isPopular
          ? "border-accent-border bg-gradient-to-b from-accent/30 to-transparent backdrop-blur-md shadow-[0_0_40px_rgba(190,242,100,0.12)] scale-[1.02]"
          : "border-border bg-card backdrop-blur-md shadow-xs hover:border-border-strong"
      }`}
    >
      <CardHeader className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xl font-bold font-heading text-foreground">{name}</CardTitle>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
              isPopular
                ? "bg-primary text-primary-foreground shadow-[0_0_10px_var(--glow-lime)]"
                : "bg-muted border border-border text-muted-foreground"
            }`}
          >
            {badge}
          </span>
        </div>
        <CardDescription className="mt-2 text-xs text-muted-foreground font-light leading-relaxed">
          {desc}
        </CardDescription>
        <div className="mt-4 flex items-baseline gap-1.5 border-t border-border pt-4">
          <span className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
            {priceDisplay}
          </span>
          <span className="text-xs text-muted-foreground font-light">{periodDisplay}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-6 sm:px-8 pb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-accent-foreground mb-3">
          What&apos;s included
        </p>
        <ul className="space-y-2.5">
          {features.map((feat) => (
            <li key={feat.key} className="flex items-start gap-2 text-xs">
              <Check className="size-3.5 text-accent-foreground shrink-0 mt-0.5" />
              <span>
                <span className="text-foreground-soft">{feat.label}</span>
                {feat.limit != null && (
                  <span className="text-muted-foreground"> · up to {feat.limit}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="p-6 sm:px-8 pb-8 pt-0">
        <Button
          size="lg"
          className={`w-full rounded-full cursor-pointer font-semibold ${
            isPopular ? "shadow-[0_0_20px_rgba(190,242,100,0.25)]" : ""
          }`}
          variant={isPopular ? "default" : "glass"}
          render={<Link href={ctaHref} />}
        >
          <span>{ctaLabel}</span>
          <ArrowRight className="size-4" data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  );
}

/* ─── live plan card (from API) ───────────────────────────────── */

export function LivePricingCard({
  plan,
  index,
  isAuthenticated,
}: {
  plan: PublicPlan;
  index: number;
  isAuthenticated: boolean;
}) {
  const isPopular =
    index === 1 ||
    plan.slug.includes("standard") ||
    plan.slug.includes("basic");

  const href = isAuthenticated
    ? `/post-auth?plan=${encodeURIComponent(plan.slug)}`
    : `/signup?plan=${encodeURIComponent(plan.slug)}`;

  return (
    <PricingCardShell
      name={plan.name}
      badge={
        plan.trial.included
          ? `${plan.trial.days}-Day Trial`
          : isPopular
          ? "Recommended"
          : "Active Plan"
      }
      desc="For coaching centers building a dependable daily rhythm."
      priceDisplay={formatBdt(plan.priceMinor)}
      periodDisplay={`/ ${durationLabel(plan.durationDays)}`}
      features={plan.features.map((f) => ({
        key: f.key,
        label: f.name,
        limit: f.defaultLimit,
      }))}
      isPopular={isPopular}
      ctaHref={href}
      ctaLabel={`Choose ${plan.name}`}
    />
  );
}

/* ─── static fallback card ────────────────────────────────────── */

export function StaticPricingCard({
  tier,
  isAuthenticated,
}: {
  tier: StaticTier;
  isAuthenticated: boolean;
}) {
  return (
    <PricingCardShell
      name={tier.name}
      badge={tier.badge}
      desc={tier.desc}
      priceDisplay={tier.price}
      periodDisplay={tier.period}
      features={tier.features.map((f) => ({ key: f, label: f }))}
      isPopular={tier.highlight ?? false}
      ctaHref={isAuthenticated ? "/post-auth" : "/signup"}
      ctaLabel="Start Free Trial"
    />
  );
}
