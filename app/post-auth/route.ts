import { NextRequest, NextResponse } from 'next/server';
import {
  getAccountRoutingState,
  postAuthDestinations,
  resolvePostAuthDestination,
} from '@/lib/auth/post-auth-destination';
import {
  SELECTED_PLAN_COOKIE,
  SELECTED_PLAN_COOKIE_OPTIONS,
  validateSelectedPlanSlug,
} from '@/lib/selected-plan';
import { SELECTED_WORKSPACE_COOKIE } from '@/lib/workspace';

export async function GET(request: NextRequest) {
  const requestedPlan = request.nextUrl.searchParams.get('plan') || undefined;
  const validPlanSlug = requestedPlan
    ? ((await validateSelectedPlanSlug(requestedPlan)) ?? undefined)
    : undefined;
  const hasInvalidPlan = Boolean(requestedPlan && !validPlanSlug);
  const destination = await resolvePostAuthDestination({ selectedPlanSlug: validPlanSlug });
  const response = NextResponse.redirect(new URL(destination, request.url));
  const accountState = await getAccountRoutingState();

  if (requestedPlan && validPlanSlug) {
    response.cookies.set(SELECTED_PLAN_COOKIE, validPlanSlug, SELECTED_PLAN_COOKIE_OPTIONS);
  } else if (hasInvalidPlan) {
    response.cookies.delete(SELECTED_PLAN_COOKIE);
  }

  if (destination === postAuthDestinations.dashboard && accountState?.workspaceId) {
    response.cookies.set(SELECTED_WORKSPACE_COOKIE, accountState.workspaceId, {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
  } else if (destination !== postAuthDestinations.dashboard) {
    response.cookies.delete(SELECTED_WORKSPACE_COOKIE);
  }

  return response;
}
