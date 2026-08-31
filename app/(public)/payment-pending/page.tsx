import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PublicContainer } from "@/components/public/public-container";
import { PaymentPendingClient, type PaymentPlanContext } from "@/components/payment-pending/payment-pending-client";
import { getLatestPaymentRequestServer } from "@/features/payments/api/get-latest-payment-request-server";
import { getPublicPlans } from "@/features/pricing/api/get-public-plans";
import { postAuthDestinations, resolvePostAuthDestination } from "@/lib/auth/post-auth-destination";
import { SELECTED_PLAN_COOKIE } from "@/lib/selected-plan";
import { SELECTED_WORKSPACE_COOKIE } from "@/lib/workspace";

export default async function PaymentPendingPage() {
  const destination = await resolvePostAuthDestination();
  if (destination === "/signin") redirect("/signin");
  if (destination === postAuthDestinations.platform) redirect(postAuthDestinations.platform);
  if (destination === postAuthDestinations.onboarding) redirect(postAuthDestinations.onboarding);

  const cookieStore = await cookies();
  const workspaceId = cookieStore.get(SELECTED_WORKSPACE_COOKIE)?.value;
  if (!workspaceId) redirect(postAuthDestinations.onboarding);

  const [latestPaymentResult, plans] = await Promise.all([
    getLatestPaymentRequestServer(workspaceId),
    getPublicPlans()
  ]);
  const payment = latestPaymentResult.ok ? latestPaymentResult.payment : null;
  const selectedPlanSlug = cookieStore.get(SELECTED_PLAN_COOKIE)?.value;
  const selectedPlan = payment?.planId
    ? plans?.find((plan) => plan.id === payment.planId)
    : plans?.find((plan) => plan.slug === selectedPlanSlug);

  if (payment?.status === "approved") redirect("/post-auth");
  if (payment?.status !== "rejected" && destination !== postAuthDestinations.paymentPending) redirect(destination);

  const planContext: PaymentPlanContext | undefined = selectedPlan
    ? {
        id: selectedPlan.id,
        name: selectedPlan.name,
        slug: selectedPlan.slug,
        priceMinor: selectedPlan.priceMinor,
        durationDays: selectedPlan.durationDays,
        trial: selectedPlan.trial
      }
    : undefined;

  return (
    <PublicContainer className="flex flex-1 items-start py-16 sm:py-24">
      <PaymentPendingClient
        workspaceId={workspaceId}
        initialPayment={latestPaymentResult.ok ? latestPaymentResult.payment : undefined}
        selectedPlan={planContext}
      />
    </PublicContainer>
  );
}
