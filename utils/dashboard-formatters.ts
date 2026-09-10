import type {
  DashboardQuickAction,
  DashboardStatusVisual,
  DashboardSummary,
} from '@/types/dashboard';
import { CalendarCheck, Settings, UserRoundCog, Users } from 'lucide-react';

const accessVisuals: Record<string, DashboardStatusVisual> = {
  active: 'success',
  trial: 'info',
  renewal_due: 'warning',
  payment_pending: 'warning',
  subscription_expired: 'danger',
  locked: 'danger',
  suspended: 'danger',
  scheduled_for_deletion: 'danger',
  verification_pending: 'warning',
};

const accessLabels: Record<string, string> = {
  active: 'Active',
  trial: 'Trial',
  renewal_due: 'Renewal due',
  payment_pending: 'Payment pending',
  subscription_expired: 'Subscription expired',
  locked: 'Locked',
  suspended: 'Suspended',
  scheduled_for_deletion: 'Deletion scheduled',
  verification_pending: 'Verification pending',
};

export const dashboardQuickActions: DashboardQuickAction[] = [
  {
    title: 'Students',
    description: 'Manage student records, profiles, and enrollments.',
    href: '/dashboard/students',
    icon: Users,
  },
  {
    title: 'Attendance',
    description: 'Create sessions and record daily attendance.',
    href: '/dashboard/attendance',
    icon: CalendarCheck,
  },
  {
    title: 'Staff',
    description: 'Manage workspace members and roles from your staff area.',
    href: '/dashboard/staff',
    icon: UserRoundCog,
  },
  {
    title: 'Settings',
    description: 'Review your workspace preferences and configuration.',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function formatDashboardDate(value: string | null) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function getAccessLabel(status: string) {
  return accessLabels[status] ?? status;
}

export function getAccessVisual(status: string): DashboardStatusVisual {
  return accessVisuals[status] ?? 'info';
}

export function getEntitlementSummary(summary: DashboardSummary) {
  const enabled = summary.entitlements.filter((item) => item.enabled);
  if (!summary.entitlements.length) return 'No plan features configured';
  return `${enabled.length} of ${summary.entitlements.length} features enabled`;
}
