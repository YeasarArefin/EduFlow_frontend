import { headers } from 'next/headers';
import { env } from '@/config/env';
import { validateSelectedPlanSlug } from '@/lib/selected-plan';
import { getServerSession } from '@/lib/auth/server';

export const postAuthDestinations = {
  verifyEmail: '/verify-email',
  platform: '/platform',
  onboarding: '/onboarding',
  checkout: '/checkout',
  pricing: '/pricing',
  account: '/account',
  paymentPending: '/payment-pending',
  dashboard: '/workspace/dashboard',
} as const;

export type AccountRoutingState = {
  route: 'dashboard' | 'workspace_creation' | 'payment_pending' | 'account';
  workspaceId?: string;
};

export async function getAccountRoutingState(): Promise<AccountRoutingState | null> {
  const requestHeaders = await headers();
  try {
    const response = await fetch(`${env.apiBaseUrl}/account/state`, {
      headers: { cookie: requestHeaders.get('cookie') ?? '' },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { data?: AccountRoutingState };
    return payload.data ?? null;
  } catch {
    return null;
  }
}

export async function resolvePostAuthDestination({
  selectedPlanSlug,
}: {
  selectedPlanSlug?: string;
} = {}): Promise<string> {
  const session = await getServerSession();
  if (!session?.user?.id) return '/signin';
  if (!session.user.emailVerified) return postAuthDestinations.verifyEmail;

  const requestHeaders = await headers();
  try {
    const platformAccess = await fetch(`${env.apiBaseUrl}/plans`, {
      headers: { cookie: requestHeaders.get('cookie') ?? '' },
      cache: 'no-store',
    });
    if (platformAccess.ok) return postAuthDestinations.platform;
  } catch {
    return postAuthDestinations.account;
  }

  const state = await getAccountRoutingState();
  if (!state) return postAuthDestinations.account;
  if (state.route === 'dashboard') return postAuthDestinations.dashboard;
  if (state.route === 'workspace_creation') return postAuthDestinations.onboarding;
  if (state.route === 'payment_pending') return postAuthDestinations.paymentPending;

  const validPlanSlug = await validateSelectedPlanSlug(selectedPlanSlug);
  return validPlanSlug ? postAuthDestinations.checkout : postAuthDestinations.account;
}
