import {
  Building2,
  CalendarRange,
  CreditCard,
  LockKeyhole,
  Layers,
  LayoutDashboard,
  ReceiptText,
  ScrollText,
  ShieldCheck,
} from 'lucide-react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { serverEnv } from '@/config/server-env';
import { AppShell, type AppShellNavGroup } from '@/components/app-shell/app-shell';
import { getServerSession } from '@/lib/auth/server';
import type { ReactNode } from 'react';

const navigation: AppShellNavGroup[] = [
  {
    label: 'Platform',
    items: [
      {
        label: 'Overview',
        href: '/platform',
        icon: <LayoutDashboard className="size-4" />,
      },
      {
        label: 'Workspaces',
        href: '/platform/workspaces',
        icon: <Building2 className="size-4" />,
      },
      {
        label: 'Subscriptions',
        href: '/platform/subscriptions',
        icon: <CalendarRange className="size-4" />,
      },
      {
        label: 'Deletion queue',
        href: '/platform/deletion-queue',
        icon: <LockKeyhole className="size-4" />,
      },
      {
        label: 'Payments',
        href: '/platform/payments',
        icon: <CreditCard className="size-4" />,
      },
      {
        label: 'Revenue',
        href: '/platform/revenue',
        icon: <ReceiptText className="size-4" />,
      },
      {
        label: 'Activity',
        href: '/platform/activity',
        icon: <ScrollText className="size-4" />,
      },
      {
        label: 'Plans',
        href: '/platform/plans',
        icon: <Layers className="size-4" />,
      },
      {
        label: 'Entitlements',
        href: '/platform/entitlements',
        icon: <ShieldCheck className="size-4" />,
      },
    ],
  },
];

export default async function PlatformLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session?.user?.id) redirect('/signin');
  const cookie = (await headers()).get('cookie') ?? '';
  const access = await fetch(`${serverEnv.apiBaseUrl}/plans`, {
    headers: { cookie },
    cache: 'no-store',
  });
  if (access.status === 403) redirect('/onboarding');
  if (!access.ok) redirect('/signin');
  return (
    <AppShell
      navigation={navigation}
      productName="EduFlow"
      isAdmin
      user={{ name: session.user.name || 'Platform Owner', email: session.user.email ?? undefined }}
    >
      {children}
    </AppShell>
  );
}
