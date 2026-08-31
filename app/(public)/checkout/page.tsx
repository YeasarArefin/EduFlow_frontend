import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicContainer } from "@/components/public/public-container";
import { getPublicPlans, type PublicPlan } from "@/features/pricing/api/get-public-plans";
import { postAuthDestinations, resolvePostAuthDestination } from "@/lib/auth/post-auth-destination";
import { SELECTED_PLAN_COOKIE } from "@/lib/selected-plan";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { ManualPaymentForm } from "@/components/checkout/manual-payment-form";
import { SELECTED_WORKSPACE_COOKIE } from "@/lib/workspace";

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

function findSelectedPlan(plans: PublicPlan[] | null, slug: string | undefined) {
  return plans?.find((plan) => plan.slug === slug);
}

export default async function CheckoutPage() {
  const destination = await resolvePostAuthDestination();
  if (destination !== postAuthDestinations.checkout) redirect(destination);

  const selectedPlanSlug = (await cookies()).get(SELECTED_PLAN_COOKIE)?.value;
  const selectedPlan = findSelectedPlan(await getPublicPlans(), selectedPlanSlug);
  if (!selectedPlan) redirect(postAuthDestinations.pricing);
  const workspaceId = (await cookies()).get(SELECTED_WORKSPACE_COOKIE)?.value;
  if (!workspaceId) redirect(postAuthDestinations.onboarding);

  return (
    <PublicContainer className="flex flex-1 items-center py-16 sm:py-24">
      <div className="w-full max-w-2xl">
        <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">Continue with {selectedPlan.name}</h1>
        <p className="mt-4 max-w-xl leading-7 text-muted-foreground">Your workspace and plan are ready. Payment setup will be available here in the next step.</p>
        <Card className="mt-10">
          <CardHeader>
            <CardTitle>{selectedPlan.name}</CardTitle>
            <CardDescription>EduFlow plan for your coaching center</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <p><span className="font-heading text-3xl font-medium tracking-tight">{formatBdt(selectedPlan.priceMinor)}</span><span className="ml-2 text-muted-foreground">/ {durationLabel(selectedPlan.durationDays)}</span></p>
            {selectedPlan.trial.included && <p className="text-muted-foreground">Includes a {selectedPlan.trial.days}-day trial.</p>}
            <p className="text-muted-foreground">This selection is loaded from EduFlow’s current active plans.</p>
          </CardContent>
          <CardContent><ManualPaymentForm workspaceId={workspaceId} /></CardContent>
          <CardFooter className="gap-3"><Button render={<Link href="/pricing" />} variant="outline">Change plan</Button></CardFooter>
        </Card>
      </div>
    </PublicContainer>
  );
}
