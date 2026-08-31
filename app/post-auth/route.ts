import { NextRequest, NextResponse } from "next/server";
import { resolvePostAuthDestination } from "@/lib/auth/post-auth-destination";
import { SELECTED_PLAN_COOKIE, SELECTED_PLAN_COOKIE_OPTIONS, validateSelectedPlanSlug } from "@/lib/selected-plan";

export async function GET(request: NextRequest) {
  const requestedPlan = request.nextUrl.searchParams.get("plan") || undefined;
  const storedPlan = request.cookies.get(SELECTED_PLAN_COOKIE)?.value;
  const candidatePlan = requestedPlan ?? storedPlan;
  const validPlanSlug = candidatePlan ? (await validateSelectedPlanSlug(candidatePlan)) ?? undefined : undefined;
  const hasInvalidPlan = Boolean(candidatePlan && !validPlanSlug);
  const destination = await resolvePostAuthDestination({
    selectedPlanSlug: validPlanSlug,
    ignoreStoredPlan: hasInvalidPlan
  });
  const response = NextResponse.redirect(new URL(destination, request.url));

  if (requestedPlan && validPlanSlug) {
    response.cookies.set(SELECTED_PLAN_COOKIE, validPlanSlug, SELECTED_PLAN_COOKIE_OPTIONS);
  } else if (hasInvalidPlan) {
    response.cookies.delete(SELECTED_PLAN_COOKIE);
  }

  return response;
}
