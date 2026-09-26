import type { ReactNode } from 'react';

export type AppShellNavItem = {
  label: string;
  href: string;
  icon?: ReactNode;
};

export type AppShellNavGroup = {
  label?: string;
  items: AppShellNavItem[];
};

export type AppShellUser = {
  name: string;
  email?: string;
  onSignOut?: () => void;
};

export type AppShellWorkspaceSubscription = {
  status: string;
  planName: string | null;
  startsAt?: string | null;
  expiresAt?: string | null;
  trialEndsAt?: string | null;
  renewalDueAt?: string | null;
};

export type AppShellWorkspace = {
  id?: string;
  name?: string | null;
  status?: string;
  subscription?: AppShellWorkspaceSubscription | null;
};

export type AppShellProps = {
  children: ReactNode;
  navigation: AppShellNavGroup[];
  productName?: string;
  isAdmin?: boolean;
  user?: AppShellUser;
  workspace?: AppShellWorkspace;
};

export type ShellBrandProps = Pick<AppShellProps, 'productName' | 'isAdmin'> & {
  productName: string;
  isCollapsed?: boolean;
};

export type ShellFooterProps = Pick<AppShellProps, 'isAdmin' | 'user' | 'workspace'> & {
  isCollapsed?: boolean;
};

export type ShellNavigationProps = {
  groups: AppShellNavGroup[];
  pathname: string;
  onNavigate: () => void;
  isCollapsed?: boolean;
};
