import { ManualPaymentForm } from '@/features/payments/components/manual-payment-form';
import { PublicContainer } from '@/components/public/public-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getPublicPlans } from '@/features/pricing/api/get-public-plans';
import { findPublicPlan } from '@/utils/public-plan';
import { durationLabel, formatBdt } from '@/lib/format-money';
import { postAuthDestinations, resolvePostAuthDestination } from '@/lib/auth/post-auth-destination';
import { SELECTED_PLAN_COOKIE } from '@/lib/selected-plan';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function CheckoutPage() {
  const selectedPlanSlug = (await cookies()).get(SELECTED_PLAN_COOKIE)?.value;
  const destination = await resolvePostAuthDestination({ selectedPlanSlug });
  if (destination !== postAuthDestinations.checkout) redirect(destination);

  const selectedPlan = findPublicPlan(await getPublicPlans(), selectedPlanSlug);
  if (!selectedPlan) redirect(postAuthDestinations.pricing);
  return (
    <PublicContainer className="flex flex-1 items-center py-16 sm:py-24">
      <div className="w-full max-w-2xl">
        <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
          Continue with {selectedPlan.name}
        </h1>
        <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
          Submit your payment for verification. Workspace creation unlocks only after Platform Owner
          approval.
        </p>
        <Card className="mt-10">
          <CardHeader>
            <CardTitle>{selectedPlan.name}</CardTitle>
            <CardDescription>EduFlow plan for your coaching center</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <p>
              <span className="font-heading text-3xl font-medium tracking-tight">
                {formatBdt(selectedPlan.priceMinor)}
              </span>
              <span className="ml-2 text-muted-foreground">
                / {durationLabel(selectedPlan.durationDays)}
              </span>
            </p>
            {selectedPlan.trial.included && (
              <p className="text-muted-foreground">
                Includes a {selectedPlan.trial.days}-day trial.
              </p>
            )}
            <p className="text-muted-foreground">
              This selection is loaded from EduFlow’s current active plans.
            </p>
          </CardContent>
          <CardContent>
            <ManualPaymentForm />
          </CardContent>
          <CardFooter className="gap-3">
            <Button render={<Link href="/pricing" />} variant="outline">
              Change plan
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PublicContainer>
  );
}
