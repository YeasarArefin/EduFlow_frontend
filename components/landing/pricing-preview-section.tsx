import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicPlan } from "@/features/pricing/api/get-public-plans";

function formatBdt(priceMinor: string) {
  const normalized = priceMinor.replace(/^0+(?=\d)/, "");
  const whole = normalized.length > 2 ? normalized.slice(0, -2) : "0";
  const poisha = normalized.slice(-2).padStart(2, "0");
  return `৳${whole}.${poisha}`;
}

function durationLabel(days: number) {
  if (days === 365) return "year";
  if (days === 30) return "month";
  return `${days} days`;
}

interface PricingPreviewProps {
  plans?: PublicPlan[] | null;
  isAuthenticated?: boolean;
}

export function PricingPreviewSection({ plans, isAuthenticated = false }: PricingPreviewProps) {
  const hasDynamicPlans = Boolean(plans && plans.length > 0);

  return (
    <section className="border-b border-border/80 py-20 sm:py-28 lg:py-32 bg-surface-soft/40" id="pricing">
      <PublicContainer>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Predictable Pricing
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Transparent plans for coaching centers of any size.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Start with our full-featured 14-day trial. Upgrade only when you are ready to expand your batches.
          </p>
        </div>

        {/* Dynamic / Live Pricing Cards */}
        {hasDynamicPlans && plans ? (
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {plans.map((plan, index) => {
              const isPopular = index === 1 || plan.slug.includes("standard") || plan.slug.includes("basic");
              const href = isAuthenticated
                ? `/post-auth?plan=${encodeURIComponent(plan.slug)}`
                : `/signup?plan=${encodeURIComponent(plan.slug)}`;

              return (
                <Card
                  key={plan.id}
                  className={`flex flex-col justify-between rounded-2xl transition-all ${
                    isPopular
                      ? "border-foreground bg-card shadow-xl ring-2 ring-foreground/20 scale-[1.02]"
                      : "border-border/80 bg-card shadow-xs hover:border-foreground/40"
                  }`}
                >
                  <CardHeader className="p-6 sm:p-8">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold font-heading">{plan.name}</CardTitle>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          isPopular
                            ? "bg-foreground text-background"
                            : "bg-surface-soft border border-border text-muted-foreground"
                        }`}
                      >
                        {plan.trial.included ? `${plan.trial.days}-Day Trial` : isPopular ? "Recommended" : "Active Plan"}
                      </span>
                    </div>
                    <CardDescription className="mt-2 text-xs leading-relaxed">
                      For coaching centers building a dependable daily rhythm.
                    </CardDescription>
                    <div className="mt-4 flex items-baseline gap-1.5 border-t border-border/80 pt-4">
                      <span className="font-heading text-4xl font-bold tracking-tight text-foreground">
                        {formatBdt(plan.priceMinor)}
                      </span>
                      <span className="text-xs text-muted-foreground">/ {durationLabel(plan.durationDays)}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6 sm:px-8 pb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Included in this plan
                    </p>
                    {plan.features.length > 0 ? (
                      <ul className="space-y-2.5 text-xs text-muted-foreground">
                        {plan.features.map((feature) => (
                          <li key={feature.key} className="flex items-start gap-2">
                            <Check className="size-3.5 text-foreground shrink-0 mt-0.5" />
                            <span>
                              <span className="text-foreground font-medium">{feature.name}</span>
                              {feature.defaultLimit !== null && (
                                <span className="text-muted-foreground"> · up to {feature.defaultLimit}</span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-muted-foreground">Core workspace access for your center.</p>
                    )}
                  </CardContent>

                  <CardFooter className="p-6 sm:p-8 pt-0">
                    <Button
                      size="lg"
                      className={`w-full rounded-full cursor-pointer font-medium ${
                        isPopular ? "shadow-sm" : ""
                      }`}
                      variant={isPopular ? "default" : "outline"}
                      render={<Link href={href} />}
                    >
                      <span>Choose {plan.name}</span>
                      <ArrowRight className="size-4" data-icon="inline-end" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              {
                name: "Starter",
                badge: "14-Day Free Trial",
                price: "৳1,500",
                period: "per month",
                desc: "Ideal for individual tutors and private batch instructors.",
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
                features: [
                  "Up to 200 Active Students",
                  "Unlimited Batches & Schedules",
                  "5 Staff & Teacher Seats",
                  "Automated Fee Receipts & Dues",
                  "2,000 Free SMS / month",
                  "Bilingual Parent SMS Templates",
                  "Priority WhatsApp Support",
                ],
                highlight: true,
              },
              {
                name: "Pro",
                badge: "Maximum Scale",
                price: "৳7,000",
                period: "per month",
                desc: "For established institutes needing full operational automation.",
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
            ].map((tier) => (
              <Card
                key={tier.name}
                className={`flex flex-col justify-between rounded-2xl transition-all ${
                  tier.highlight
                    ? "border-foreground bg-card shadow-xl ring-2 ring-foreground/20 scale-[1.02]"
                    : "border-border/80 bg-card shadow-xs hover:border-foreground/40"
                }`}
              >
                <CardHeader className="p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold font-heading">{tier.name}</CardTitle>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        tier.highlight
                          ? "bg-foreground text-background"
                          : "bg-surface-soft border border-border text-muted-foreground"
                      }`}
                    >
                      {tier.badge}
                    </span>
                  </div>
                  <CardDescription className="mt-2 text-xs leading-relaxed">{tier.desc}</CardDescription>
                  <div className="mt-4 flex items-baseline gap-1.5 border-t border-border/80 pt-4">
                    <span className="font-heading text-4xl font-bold tracking-tight text-foreground">
                      {tier.price}
                    </span>
                    <span className="text-xs text-muted-foreground">{tier.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="px-6 sm:px-8 pb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    What&apos;s included
                  </p>
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <Check className="size-3.5 text-foreground shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="p-6 sm:p-8 pt-0">
                  <Button
                    size="lg"
                    className={`w-full rounded-full cursor-pointer font-medium ${
                      tier.highlight ? "shadow-sm" : ""
                    }`}
                    variant={tier.highlight ? "default" : "outline"}
                    render={<Link href="/signup" />}
                  >
                    <span>Start Free Trial</span>
                    <ArrowRight className="size-4" data-icon="inline-end" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Compare All Plans Link */}
        <div className="mt-12 text-center">
          <Button
            variant="ghost"
            className="rounded-full text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            render={<Link href="/pricing" />}
          >
            <span>View dedicated Pricing Page & full feature comparison</span>
            <ArrowRight className="size-3.5" data-icon="inline-end" />
          </Button>
        </div>
      </PublicContainer>
    </section>
  );
}

