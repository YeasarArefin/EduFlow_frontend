export const PLATFORM_WORKSPACE_STATUSES = [
  'pending',
  'active',
  'locked',
  'suspended',
  'scheduled_deletion',
  'deleted',
] as const;

export const PLATFORM_SUBSCRIPTION_STATUSES = [
  'trial',
  'pending',
  'active',
  'renewal_due',
  'expired',
  'cancelled',
  'suspended',
] as const;

export const PLATFORM_ACCESS_STATUSES = [
  'verification_pending',
  'payment_pending',
  'trial',
  'active',
  'renewal_due',
  'subscription_expired',
  'locked',
  'scheduled_for_deletion',
  'suspended',
] as const;

export type PaginationMeta = { page: number; limit: number; total: number; totalPages: number };
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
  access: { allowed: boolean; status: (typeof PLATFORM_ACCESS_STATUSES)[number]; reason: string };
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
    plan: {
      id: string;
      name: string;
      slug: string;
      priceMinor: string;
      durationDays: number;
      trialDays: number;
    } | null;
  } | null;
  access: PlatformWorkspace['access'];
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
    purpose: 'subscription' | 'sms_credit';
    amountMinor: string;
    method: 'cash' | 'bkash' | 'nagad' | 'rocket' | 'other';
    transactionId: string;
    status: 'pending' | 'approved' | 'rejected';
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
export type PlatformActivity = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  actor: { id: string; name: string; email: string } | null;
  workspace: { id: string; name: string | null; slug: string | null } | null;
  metadataSummary: Array<{ key: string; value: string }> | null;
};
export type ActivityListParams = {
  page: number;
  limit: number;
  search?: string;
  category?: 'payment' | 'plan' | 'entitlement' | 'lifecycle';
};
export type WorkspaceEntitlementOverride = {
  id: string;
  workspaceId: string;
  featureKey: string;
  enabledOverride: boolean | null;
  limitOverride: string | null;
  reason: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};
export type WorkspaceEntitlementOverrideInput = Omit<
  WorkspaceEntitlementOverride,
  'id' | 'workspaceId' | 'createdAt' | 'updatedAt'
>;
export type PlatformPayment = {
  id: string;
  purpose: 'subscription' | 'sms_credit';
  amountMinor: string;
  paymentMethod: 'cash' | 'bkash' | 'nagad' | 'rocket' | 'other';
  senderNumber: string;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  requestedByUserId: string | null;
  workspace: { id: string; name: string | null; slug: string | null } | null;
  plan: { id: string; name: string; slug: string } | null;
};
export type PlatformPlanFeature = {
  featureKey: string;
  enabled: boolean;
  limitValue: string | null;
};
export type PlatformPlan = {
  id: string;
  name: string;
  slug: string;
  priceMinor: string;
  durationDays: number;
  trialDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  features: PlatformPlanFeature[];
};
export type PlatformFeatureCatalogItem = { key: string; name: string; description: string | null };
export type PlatformPlanInput = Pick<
  PlatformPlan,
  'name' | 'slug' | 'priceMinor' | 'durationDays' | 'trialDays'
>;
export type RevenueOverview = {
  metrics: {
    approvedRevenueMinor: string;
    pendingAmountMinor: string;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
  };
  byPlan: Array<{
    plan: { id: string; name: string; slug: string } | null;
    revenueMinor: string;
    approvedCount: number;
  }>;
  recent: Array<{
    id: string;
    status: 'pending' | 'approved' | 'rejected';
    amountMinor: string;
    method: string;
    transactionId: string;
    createdAt: string;
    workspace: { id: string; name: string | null; slug: string | null } | null;
    plan: { id: string; name: string; slug: string } | null;
  }>;
};
export const PLATFORM_SUBSCRIPTION_LIFECYCLE_OPERATIONS = [
  'renewal-due',
  'expire',
  'lock',
  'unlock',
  'schedule-deletion',
] as const;
export type PlatformSubscriptionLifecycleOperation =
  (typeof PLATFORM_SUBSCRIPTION_LIFECYCLE_OPERATIONS)[number];
export type SubscriptionLifecycleOperationResult = { workspace: unknown; subscription: unknown };
export type PlatformOverviewPayment = { id: string; status: string; createdAt: string };
export type PlatformOverviewPlan = { id: string; active?: boolean; status?: string };
export type DraftPlatformPlanFeature = PlatformPlanFeature & { quota: string };
export type PlatformPlanFormValues = {
  name: string;
  slug: string;
  price: string;
  durationDays: string;
  trialDays: string;
};
export type PlatformQueueFilter = 'all' | 'locked' | 'scheduled_deletion';
export type PlatformReviewGroup =
  'all' | 'trial' | 'active' | 'renewal_due' | 'expired' | 'locked' | 'scheduled_deletion';
export type PlatformLifecycleOperationConfig = {
  operation: PlatformSubscriptionLifecycleOperation;
  label: string;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
};
export type PlatformEntitlementOverrideDraft = {
  featureKey: string;
  enabledOverride: 'default' | 'enabled' | 'disabled';
  limitOverride: string;
  reason: string;
  expiresAt: string;
};
