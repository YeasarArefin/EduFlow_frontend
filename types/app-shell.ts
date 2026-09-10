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

export type AppShellProps = {
  children: ReactNode;
  navigation: AppShellNavGroup[];
  productName?: string;
  isAdmin?: boolean;
  user?: AppShellUser;
};

export type ShellBrandProps = Pick<AppShellProps, 'productName' | 'isAdmin'> & {
  productName: string;
};

export type ShellFooterProps = Pick<AppShellProps, 'isAdmin' | 'user'>;

export type ShellNavigationProps = {
  groups: AppShellNavGroup[];
  pathname: string;
  onNavigate: () => void;
};
