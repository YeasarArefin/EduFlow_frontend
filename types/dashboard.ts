export type DashboardSummary = {
  workspace: { id: string; name: string | null; status: string };
  access: { allowed: boolean; status: string; reason: string };
  subscription: {
    status: string;
    planName: string | null;
    startsAt: string | null;
    expiresAt: string | null;
    trialEndsAt: string | null;
    renewalDueAt: string | null;
  } | null;
  memberCount: number;
  entitlements: { key: string; enabled: boolean; limit: string | null }[];
  latestPayment: { status: string; createdAt: string; reviewedAt: string | null } | null;
};

export type DashboardSummaryResponse = { data?: DashboardSummary };

export type DashboardStatusVisual = 'success' | 'warning' | 'danger' | 'info';

export type DashboardQuickAction = {
  title: string;
  description: string;
  href: string;
  icon: import('lucide-react').LucideIcon;
};

export type DashboardDetailRowProps = {
  label: string;
  value: string | null;
};

export type WorkspaceDashboardOverviewProps = {
  workspaceId: string;
  initialSummary?: DashboardSummary | null;
};
