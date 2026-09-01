import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/config/env";
import { getPublicPlans } from "@/features/pricing/api/get-public-plans";
import { postAuthDestinations, resolvePostAuthDestination } from "@/lib/auth/post-auth-destination";
import { SELECTED_PLAN_COOKIE } from "@/lib/selected-plan";

const paymentDetailsSchema = z.object({
  paymentMethod: z.literal("bkash"),
  senderNumber: z.string().trim().min(1).max(30),
  transactionId: z.string().trim().min(1).max(100)
}).strict();

export async function POST(request: NextRequest) {
  const parsed = paymentDetailsSchema.safeParse(await request.json().catch(() => undefined));
  if (!parsed.success) return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Request validation failed." } }, { status: 400 });

  const selectedPlanSlug = request.cookies.get(SELECTED_PLAN_COOKIE)?.value;
  const destination = await resolvePostAuthDestination({ selectedPlanSlug });
  if (destination === "/signin") return errorResponse("UNAUTHENTICATED", "A valid authentication session is required.", 401);
  if (destination === postAuthDestinations.platform) return errorResponse("PLATFORM_OWNER_REQUIRED", "Platform Owner access must continue through the platform area.", 403);
  if (destination !== postAuthDestinations.checkout) return errorResponse("CHECKOUT_CONTEXT_INVALID", "Choose an active plan before submitting payment.", 400);

  const plans = await getPublicPlans();
  const selectedPlan = plans?.find((plan) => plan.slug === selectedPlanSlug);
  if (!selectedPlan) return errorResponse("CHECKOUT_CONTEXT_INVALID", "Your selected plan is no longer available.", 400);

  const backendResponse = await fetch(`${env.apiBaseUrl}/payment-requests/account`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      cookie: request.headers.get("cookie") ?? ""
    },
    body: JSON.stringify({
      planId: selectedPlan.id,
      amount: selectedPlan.priceMinor,
      paymentMethod: parsed.data.paymentMethod,
      senderNumber: parsed.data.senderNumber,
      transactionId: parsed.data.transactionId
    })
  });
  const payload = await backendResponse.json().catch(() => ({ error: { code: "PAYMENT_REQUEST_FAILED", message: "The payment request could not be submitted." } }));
  return NextResponse.json(payload, { status: backendResponse.status });
}

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}
