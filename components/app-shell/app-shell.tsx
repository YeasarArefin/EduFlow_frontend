'use client';

import { ThemeToggle } from '@/components/theme/theme-toggle';
import { ShellBrand } from '@/components/app-shell/shell-brand';
import { ShellFooter } from '@/components/app-shell/shell-footer';
import { ShellNavigation } from '@/components/app-shell/shell-navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AppShellProps } from '@/types/app-shell';
import { Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export type { AppShellNavGroup, AppShellNavItem, AppShellUser } from '@/types/app-shell';

export function AppShell({
  children,
  navigation,
  productName = 'EduFlow',
  isAdmin = false,
  user,
  workspace,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const desktopNav = (
    <ShellNavigation
      groups={navigation}
      pathname={pathname}
      onNavigate={() => setMobileOpen(false)}
      isCollapsed={isSidebarCollapsed}
    />
  );

  const mobileNav = (
    <ShellNavigation
      groups={navigation}
      pathname={pathname}
      onNavigate={() => setMobileOpen(false)}
    />
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex lg:flex-col',
          isSidebarCollapsed ? 'w-[4.5rem]' : 'w-64'
        )}
      >
        <ShellBrand productName={productName} isAdmin={isAdmin} isCollapsed={isSidebarCollapsed} />
        <div className="flex-1 overflow-y-auto px-3 py-4">{desktopNav}</div>
        <ShellFooter
          user={user}
          isAdmin={isAdmin}
          workspace={workspace}
          isCollapsed={isSidebarCollapsed}
        />
      </aside>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 ease-in-out lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Mobile navigation"
      >
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <ShellBrand productName={productName} isAdmin={isAdmin} />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">{mobileNav}</div>
        <ShellFooter user={user} isAdmin={isAdmin} workspace={workspace} />
      </aside>

      {/* Main Content Area */}
      <div
        className={cn(
          'flex min-h-screen flex-col',
          isSidebarCollapsed ? 'lg:pl-[4.5rem]' : 'lg:pl-64'
        )}
      >
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-nav px-4 backdrop-blur-[16px] lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-4" />
          </Button>

          <div className="hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-subtle-foreground lg:flex">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg"
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setIsSidebarCollapsed((value) => !value)}
            >
              {isSidebarCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </Button>
            <span>{isAdmin ? 'Platform Admin' : 'Workspace'}</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            {user && (
              <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
                {user.name}
              </span>
            )}
          </div>
        </header>

        <main className="mx-auto w-full flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
