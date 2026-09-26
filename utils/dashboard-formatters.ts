import type {
  DashboardQuickAction,
  DashboardStatusVisual,
  DashboardSummary,
} from '@/types/dashboard';
import {
  BellPlus,
  CalendarCheck,
  GraduationCap,
  ReceiptText,
  UserPlus,
  WalletCards,
} from 'lucide-react';

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
    title: 'Add student',
    description: 'Create a student record.',
    href: '/workspace/students',
    icon: UserPlus,
  },
  {
    title: 'Take attendance',
    description: 'Start today’s class record.',
    href: '/workspace/attendance',
    icon: CalendarCheck,
  },
  {
    title: 'Collect fee',
    description: 'Record a student payment.',
    href: '/workspace/fees',
    icon: ReceiptText,
  },
  {
    title: 'Create batch',
    description: 'Set up a new class batch.',
    href: '/workspace/batches',
    icon: GraduationCap,
  },
  {
    title: 'Create notice',
    description: 'Prepare a student announcement.',
    href: '/workspace/notices',
    icon: BellPlus,
  },
  {
    title: 'Record expense',
    description: 'Add a coaching cost.',
    href: '/workspace/expenses',
    icon: WalletCards,
  },
];

export function formatDashboardMoney(value: string) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

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

const featureNames: Record<string, string> = {
  students: 'Student Directory & Profiles',
  batches: 'Batch & Routine Scheduling',
  teachers: 'Teacher & Faculty Management',
  attendance: 'Live Attendance Tracking',
  fees: 'Tuition Fee Billing & Receipts',
  salaries: 'Teacher Salary Payroll',
  sms_wallet: 'SMS Notifications Wallet',
  custom_roles: 'Custom Roles & Permissions',
  audit_logs: 'Security & Audit Logs',
  expenses: 'Expense Tracking',
  notices: 'Notice Board & Alerts',
};

export function formatFeatureName(key: string): string {
  if (featureNames[key]) return featureNames[key];
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getDaysRemaining(dateStr: string | null): number | null {
  if (!dateStr) return null;
  try {
    const target = new Date(dateStr).getTime();
    if (isNaN(target)) return null;
    const now = Date.now();
    return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}
