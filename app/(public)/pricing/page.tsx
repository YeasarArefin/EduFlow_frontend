import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicPlans, type PublicPlan } from "@/features/pricing/api/get-public-plans";
import { getServerSession } from "@/lib/auth/server";

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

function PlanCard({ plan, isAuthenticated }: { plan: PublicPlan; isAuthenticated: boolean }) {
  return (
    <Card className="flex h-full flex-col bg-background">
      <CardHeader className="gap-3 p-8">
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>For coaching centers building a dependable daily rhythm.</CardDescription>
        <div className="pt-3"><span className="font-heading text-4xl font-medium tracking-tight">{formatBdt(plan.priceMinor)}</span><span className="ml-2 text-sm text-muted-foreground">/ {durationLabel(plan.durationDays)}</span></div>
        {plan.trial.included && <p className="text-sm font-medium text-foreground">Includes a {plan.trial.days}-day trial</p>}
      </CardHeader>
      <CardContent className="flex-1 px-8 pb-8">
        <div className="border-t border-border pt-6"><p className="text-sm font-medium">Included in this plan</p>{plan.features.length > 0 ? <ul className="mt-4 flex flex-col gap-3">{plan.features.map((feature) => <li key={feature.key} className="flex gap-3 text-sm text-muted-foreground"><Check className="mt-0.5 shrink-0 text-foreground" /><span><span className="text-foreground">{feature.name}</span>{feature.defaultLimit !== null && <span> · up to {feature.defaultLimit}</span>}{feature.description && <span className="block pt-0.5 text-xs">{feature.description}</span>}</span></li>)}</ul> : <p className="mt-4 text-sm text-muted-foreground">Core workspace access for your center.</p>}</div>
      </CardContent>
      <CardFooter className="border-0 bg-transparent p-8 pt-0"><Button render={<Link href={isAuthenticated ? `/post-auth?plan=${encodeURIComponent(plan.slug)}` : `/signup?plan=${encodeURIComponent(plan.slug)}`} />} className="w-full" size="lg">Choose {plan.name} <ArrowRight data-icon="inline-end" /></Button></CardFooter>
    </Card>
  );
}

export default async function PricingPage() {
  const [plans, session] = await Promise.all([getPublicPlans(), getServerSession()]);

  return <PublicContainer className="w-full py-20 sm:py-28"><div className="mx-auto max-w-2xl text-center"><p className="text-sm font-medium text-muted-foreground">Plans for your next stage</p><h1 className="mt-3 font-heading text-4xl font-medium tracking-tight sm:text-5xl">Choose the right pace for your center.</h1><p className="mt-5 text-base leading-7 text-muted-foreground">Start with the tools your team needs today and keep your focus on students, not subscription math.</p></div>{plans === null ? <div className="mx-auto mt-16 max-w-xl rounded-xl border border-border bg-muted/20 px-6 py-10 text-center"><h2 className="font-heading text-xl font-medium">Plans are temporarily unavailable</h2><p className="mt-2 text-sm text-muted-foreground">We couldn&apos;t load the current plans. Please check back shortly.</p></div> : plans.length === 0 ? <div className="mx-auto mt-16 max-w-xl rounded-xl border border-border bg-muted/20 px-6 py-10 text-center"><h2 className="font-heading text-xl font-medium">Plans are coming soon</h2><p className="mt-2 text-sm text-muted-foreground">There are no active plans available right now.</p></div> : <div className="mx-auto mt-16 grid max-w-6xl gap-5 lg:grid-cols-3">{plans.map((plan) => <PlanCard key={plan.id} plan={plan} isAuthenticated={Boolean(session?.user?.id)} />)}</div>}<p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">Prices are shown in Bangladeshi taka. Your selected plan will be carried into account setup.</p></PublicContainer>;
}
