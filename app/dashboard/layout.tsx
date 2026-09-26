import {
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  Settings,
  Users,
  GraduationCap,
  Layers3,
  Wallet,
  ShieldCheck,
  Bell,
  ReceiptText,
  MessageSquareText,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { AppShell, type AppShellNavGroup } from '@/components/app-shell/app-shell';
import { getServerSession } from '@/lib/auth/server';
import {
  getAccountRoutingState,
  postAuthDestinations,
  resolvePostAuthDestination,
} from '@/lib/auth/post-auth-destination';
import { getDashboardSummaryServer } from '@/features/dashboard/api/get-dashboard-summary-server';

const navigation: AppShellNavGroup[] = [
  {
    label: 'Coaching Center',
    items: [
      {
        label: 'Dashboard',
        href: '/workspace/dashboard',
        icon: <LayoutDashboard className="size-4" />,
      },
      {
        label: 'Students',
        href: '/workspace/students',
        icon: <Users className="size-4" />,
      },
      {
        label: 'Teachers',
        href: '/workspace/teachers',
        icon: <GraduationCap className="size-4" />,
      },
      { label: 'Batches', href: '/workspace/batches', icon: <Layers3 className="size-4" /> },
      { label: 'Notices', href: '/workspace/notices', icon: <Bell className="size-4" /> },
      {
        label: 'Send SMS',
        href: '/workspace/communication/send',
        icon: <MessageSquareText className="size-4" />,
      },
      {
        label: 'Attendance',
        href: '/workspace/attendance',
        icon: <CalendarCheck className="size-4" />,
      },
      {
        label: 'Fees & Payments',
        href: '/workspace/fees',
        icon: <CreditCard className="size-4" />,
      },
      {
        label: 'Teacher Salaries',
        href: '/workspace/salaries',
        icon: <Wallet className="size-4" />,
      },
      { label: 'Expenses', href: '/workspace/expenses', icon: <ReceiptText className="size-4" /> },
      {
        label: 'Staff & Members',
        href: '/workspace/staff',
        icon: <ShieldCheck className="size-4" />,
      },
      {
        label: 'Settings',
        href: '/workspace/settings',
        icon: <Settings className="size-4" />,
      },
    ],
  },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const [session, destination, accountState] = await Promise.all([
    getServerSession(),
    resolvePostAuthDestination(),
    getAccountRoutingState(),
  ]);

  if (destination !== postAuthDestinations.dashboard) redirect(destination);

  const summary = accountState?.workspaceId
    ? await getDashboardSummaryServer(accountState.workspaceId)
    : null;

  return (
    <AppShell
      navigation={navigation}
      productName="EduFlow"
      user={{
        name: session?.user?.name || 'Workspace Member',
        email: session?.user?.email ?? undefined,
      }}
      workspace={{
        id: accountState?.workspaceId,
        name: summary?.workspace?.name ?? 'My Coaching Center',
        status: summary?.workspace?.status ?? 'active',
        subscription: summary?.subscription ?? null,
      }}
    >
      {children}
    </AppShell>
  );
}
