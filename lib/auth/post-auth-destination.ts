import { cookies, headers } from "next/headers";
import { env } from "@/config/env";
import { SELECTED_PLAN_COOKIE, validateSelectedPlanSlug } from "@/lib/selected-plan";
import { SELECTED_WORKSPACE_COOKIE } from "@/lib/workspace";
import { getServerSession } from "@/lib/auth/server";

export const postAuthDestinations = {
  platform: "/platform",
  onboarding: "/onboarding",
  checkout: "/checkout",
  pricing: "/pricing",
  paymentPending: "/payment-pending",
  dashboard: "/dashboard"
} as const;

type OnboardingStep = "workspace_created" | "subscription_required" | "payment_pending" | "ready";
type OnboardingStateResponse = { data?: { step?: OnboardingStep } };

function isWorkspaceId(value: string | undefined) {
  return !!value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function resolvePostAuthDestination({
  selectedPlanSlug,
  ignoreStoredPlan = false
}: {
  selectedPlanSlug?: string;
  ignoreStoredPlan?: boolean;
} = {}): Promise<string> {
  const session = await getServerSession();
  if (!session?.user?.id) return "/signin";

  const [cookieStore, requestHeaders] = await Promise.all([cookies(), headers()]);
  const cookie = requestHeaders.get("cookie") ?? "";

  const platformAccess = await fetch(`${env.apiBaseUrl}/plans`, {
    headers: { cookie },
    cache: "no-store"
  });
  if (platformAccess.ok) return postAuthDestinations.platform;

  const workspaceId = cookieStore.get(SELECTED_WORKSPACE_COOKIE)?.value;
  const validWorkspaceId = isWorkspaceId(workspaceId) ? workspaceId : undefined;
  if (!validWorkspaceId) return postAuthDestinations.onboarding;

  const onboardingResponse = await fetch(`${env.apiBaseUrl}/workspaces/onboarding-state`, {
    headers: { cookie, "X-Workspace-Id": validWorkspaceId },
    cache: "no-store"
  });
  if (!onboardingResponse.ok) return postAuthDestinations.onboarding;

  const onboardingState = (await onboardingResponse.json()) as OnboardingStateResponse;
  switch (onboardingState.data?.step) {
    case "workspace_created": {
      const planFromCookie = ignoreStoredPlan ? undefined : cookieStore.get(SELECTED_PLAN_COOKIE)?.value;
      const validPlanSlug = await validateSelectedPlanSlug(selectedPlanSlug ?? planFromCookie);
      return validPlanSlug ? postAuthDestinations.checkout : postAuthDestinations.onboarding;
    }
    case "subscription_required": {
      const planFromCookie = ignoreStoredPlan ? undefined : cookieStore.get(SELECTED_PLAN_COOKIE)?.value;
      const validPlanSlug = await validateSelectedPlanSlug(selectedPlanSlug ?? planFromCookie);
      return validPlanSlug ? postAuthDestinations.checkout : postAuthDestinations.pricing;
    }
    case "payment_pending":
      return postAuthDestinations.paymentPending;
    case "ready":
      return postAuthDestinations.dashboard;
    default:
      return postAuthDestinations.onboarding;
  }
}
