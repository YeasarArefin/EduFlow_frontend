"use server";

import { cookies } from "next/headers";
import { SELECTED_PLAN_COOKIE, SELECTED_PLAN_COOKIE_OPTIONS, validateSelectedPlanSlug } from "@/lib/selected-plan";

export async function persistSelectedPlan(slug: string | undefined) {
  const cookieStore = await cookies();
  const validSlug = await validateSelectedPlanSlug(slug);
  if (!validSlug) {
    cookieStore.delete(SELECTED_PLAN_COOKIE);
    return null;
  }

  cookieStore.set(SELECTED_PLAN_COOKIE, validSlug, SELECTED_PLAN_COOKIE_OPTIONS);
  return validSlug;
}
