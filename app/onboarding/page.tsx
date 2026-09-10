import { WorkspaceOnboarding } from '@/features/onboarding/components/workspace-onboarding';
import { postAuthDestinations, resolvePostAuthDestination } from '@/lib/auth/post-auth-destination';
import { redirect } from 'next/navigation';

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string | string[] }>;
}) {
  const rawPlan = (await searchParams).plan;
  const requestedPlan = typeof rawPlan === 'string' ? rawPlan : undefined;
  if (requestedPlan) redirect(`/post-auth?plan=${encodeURIComponent(requestedPlan)}`);

  const destination = await resolvePostAuthDestination();
  if (destination !== postAuthDestinations.onboarding) redirect(destination);

  return <WorkspaceOnboarding />;
}
