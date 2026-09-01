import { apiListRequest, apiRequest } from "@/lib/api/client";

export const PLATFORM_WORKSPACE_STATUSES = [
  "pending",
  "active",
  "locked",
  "suspended",
  "scheduled_deletion",
  "deleted",
] as const;

export const PLATFORM_SUBSCRIPTION_STATUSES = [
  "trial",
  "pending",
  "active",
  "renewal_due",
  "expired",
  "cancelled",
  "suspended",
] as const;

export const PLATFORM_ACCESS_STATUSES = [
  "verification_pending",
  "payment_pending",
  "trial",
  "active",
  "renewal_due",
  "subscription_expired",
  "locked",
  "scheduled_for_deletion",
  "suspended",
] as const;

export type PlatformWorkspaceListParams = {
  page: number;
  limit: number;
  search?: string;
  workspaceStatus?: (typeof PLATFORM_WORKSPACE_STATUSES)[number];
  subscriptionStatus?: (typeof PLATFORM_SUBSCRIPTION_STATUSES)[number];
  accessStatus?: (typeof PLATFORM_ACCESS_STATUSES)[number];
  lifecycleQueue?: boolean;
};

export type PlatformWorkspace = {
  id: string;
  name: string | null;
  slug: string | null;
  workspaceStatus: (typeof PLATFORM_WORKSPACE_STATUSES)[number];
  createdAt: string;
  lockedAt: string | null;
  scheduledDeleteAt: string | null;
  subscription: {
    id: string;
    status: (typeof PLATFORM_SUBSCRIPTION_STATUSES)[number];
    startsAt: string | null;
    expiresAt: string | null;
    trialEndsAt: string | null;
    plan: { id: string; name: string; slug: string } | null;
  } | null;
  access: {
    allowed: boolean;
    status: (typeof PLATFORM_ACCESS_STATUSES)[number];
    reason: string;
  };
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PlatformWorkspaceDetail = {
  workspace: {
    id: string;
    name: string | null;
    slug: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    status: (typeof PLATFORM_WORKSPACE_STATUSES)[number];
    createdAt: string;
    updatedAt: string;
    activatedAt: string | null;
    lockedAt: string | null;
    scheduledDeleteAt: string | null;
  };
  subscription: {
    id: string;
    status: (typeof PLATFORM_SUBSCRIPTION_STATUSES)[number];
    startsAt: string | null;
    expiresAt: string | null;
    trialEndsAt: string | null;
    renewalDueAt: string | null;
    cancelledAt: string | null;
    plan: { id: string; name: string; slug: string; priceMinor: string; durationDays: number; trialDays: number } | null;
  } | null;
  access: PlatformWorkspace["access"];
  subscriptionHistory: Array<{
    id: string;
    status: (typeof PLATFORM_SUBSCRIPTION_STATUSES)[number];
    startsAt: string | null;
    expiresAt: string | null;
    trialEndsAt: string | null;
    renewalDueAt: string | null;
    createdAt: string;
    plan: { id: string; name: string; slug: string } | null;
  }>;
  recentPayments: Array<{
    id: string;
    purpose: "subscription" | "sms_credit";
    amountMinor: string;
    method: "cash" | "bkash" | "nagad" | "rocket" | "other";
    transactionId: string;
    status: "pending" | "approved" | "rejected";
    reviewedAt: string | null;
    createdAt: string;
    plan: { id: string; name: string; slug: string } | null;
  }>;
  activeEntitlementOverrides: Array<{
    id: string;
    featureKey: string;
    enabled: boolean | null;
    limit: string | null;
    reason: string;
    expiresAt: string | null;
    createdAt: string;
  }>;
};

export async function getPlatformWorkspaces(
  params: PlatformWorkspaceListParams,
  signal?: AbortSignal,
) {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search) searchParams.set("search", params.search);
  if (params.workspaceStatus) searchParams.set("workspaceStatus", params.workspaceStatus);
  if (params.subscriptionStatus) searchParams.set("subscriptionStatus", params.subscriptionStatus);
  if (params.accessStatus) searchParams.set("accessStatus", params.accessStatus);
  if (params.lifecycleQueue) searchParams.set("lifecycleQueue", "true");

  return apiListRequest<PlatformWorkspace[], PaginationMeta>(`/workspaces?${searchParams}`, { signal });
}

export function getPlatformWorkspaceDetail(workspaceId: string, signal?: AbortSignal) {
  return apiRequest<PlatformWorkspaceDetail>(`/workspaces/${workspaceId}`, { signal });
}
