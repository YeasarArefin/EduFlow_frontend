import { redirect } from 'next/navigation';
import { AuthForm } from '@/features/auth/components/auth-form';
import { getServerSession } from '@/lib/auth/server';
import { validateSelectedPlanSlug } from '@/lib/selected-plan';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string | string[] }>;
}) {
  const rawPlan = (await searchParams).plan;
  const selectedPlanSlug = await validateSelectedPlanSlug(
    typeof rawPlan === 'string' ? rawPlan : undefined
  );
  if (await getServerSession())
    redirect(
      selectedPlanSlug ? `/post-auth?plan=${encodeURIComponent(selectedPlanSlug)}` : '/post-auth'
    );
  return <AuthForm mode="signin" selectedPlanSlug={selectedPlanSlug ?? undefined} />;
}
