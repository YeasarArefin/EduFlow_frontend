import { WorkspaceOnboarding, type SelectedPlanContext } from "@/components/onboarding/workspace-onboarding";
import { getPublicPlans } from "@/features/pricing/api/get-public-plans";
import { postAuthDestinations, resolvePostAuthDestination } from "@/lib/auth/post-auth-destination";
import { SELECTED_PLAN_COOKIE } from "@/lib/selected-plan";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ plan?: string | string[]; }>; }) {

  const rawPlan = (await searchParams).plan;
  const requestedPlan = typeof rawPlan === "string" ? rawPlan : undefined;
  if (requestedPlan) redirect(`/post-auth?plan=${encodeURIComponent(requestedPlan)}`);

  const destination = await resolvePostAuthDestination();
  if (destination !== postAuthDestinations.onboarding) redirect(destination);

  const selectedPlanSlug = (await cookies()).get(SELECTED_PLAN_COOKIE)?.value;
  const plans = await getPublicPlans();
  const selectedPlan = plans?.find((plan) => plan.slug === selectedPlanSlug);
  const selectedPlanContext: SelectedPlanContext | undefined = selectedPlan
    ? { name: selectedPlan.name, durationDays: selectedPlan.durationDays, trial: selectedPlan.trial }
    : undefined;

  return <WorkspaceOnboarding selectedPlan={selectedPlanContext} />;
}
