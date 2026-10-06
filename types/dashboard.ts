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
  operational: {
    activeStudents: number;
    activeBatches: number;
    activeTeachers: number;
    today: {
      date: string;
      scheduledBatchCount: number;
      batches?: {
        id: string;
        name: string;
        classDays: number[];
        status: 'draft' | 'finalized' | 'not_started';
      }[];
      recentActivity?: {
        type: string;
        title: string;
        context: string;
        createdAt: string;
        href: string;
      }[];
      attendance: {
        sessionCount: number;
        finalizedSessionCount: number;
        draftSessionCount: number;
        presentCount: number;
        absentCount: number;
      };
    };
    monthlyFinance: {
      month: string;
      collectedFees: string;
      outstandingFees: string;
      paidSalaries: string;
      expenses: string;
      netCashFlow: string;
    };
  };
  monthlyCollections: { month: string; collectedFees: string }[];
};

export type DashboardSummaryResponse = { data?: DashboardSummary };

export type DashboardStatusVisual = 'success' | 'warning' | 'danger' | 'info';

export type DashboardQuickAction = {
  title: string;
  description: string;
  href: string;
  icon: import('lucide-react').LucideIcon;
};

export type WorkspaceDashboardOverviewProps = {
  workspaceId: string;
  initialSummary?: DashboardSummary | null;
};

export type TodayBatchesProps = {
  summary: DashboardSummary;
};

export type RecentActivityProps = {
  summary: DashboardSummary;
};

export type FinancialChartsProps = {
  summary: DashboardSummary;
};
