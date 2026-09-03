"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, LogOut, Menu, PanelLeft, Shield, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

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

export function AppShell({
  children,
  navigation,
  productName = "EduFlow",
  isAdmin = false,
  user,
}: {
  children: ReactNode;
  navigation: AppShellNavGroup[];
  productName?: string;
  isAdmin?: boolean;
  user?: AppShellUser;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const nav = (
    <ShellNavigation
      groups={navigation}
      pathname={pathname}
      onNavigate={() => setMobileOpen(false)}
    />
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
        <ShellBrand productName={productName} isAdmin={isAdmin} />
        <div className="flex-1 overflow-y-auto px-3 py-4">{nav}</div>
        <ShellFooter user={user} isAdmin={isAdmin} />
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
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
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
        <div className="flex-1 overflow-y-auto px-3 py-4">{nav}</div>
        <ShellFooter user={user} isAdmin={isAdmin} />
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
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
            <PanelLeft className="size-3.5" />
            <span>{isAdmin ? "Platform Admin" : "Workspace"}</span>
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

        <main className="mx-auto w-full flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function ShellBrand({
  productName,
  isAdmin,
}: {
  productName: string;
  isAdmin?: boolean;
}) {
  return (
    <Link
      href="/"
      className="flex h-14 items-center gap-2.5 px-4 text-base font-semibold tracking-tight text-sidebar-foreground transition-opacity hover:opacity-90"
    >
      <span className="flex size-7 items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
        EF
      </span>
      <span className="font-heading">{productName}</span>
      {isAdmin && (
        <span className="ml-auto rounded-full border border-sidebar-border bg-sidebar-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-accent-foreground">
          Admin
        </span>
      )}
    </Link>
  );
}

function ShellNavigation({
  groups,
  pathname,
  onNavigate,
}: {
  groups: AppShellNavGroup[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <nav className="flex flex-col gap-6" aria-label="Application navigation">
      {groups.map((group, i) => (
        <div key={group.label ?? i} className="flex flex-col gap-0.5">
          {group.label && (
            <p className="px-3.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-subtle-foreground">
              {group.label}
            </p>
          )}
          {group.items.map((item) => {
            const isRootSection =
              item.href === "/platform" || item.href === "/dashboard" || item.href === "/";
            const active =
              pathname === item.href ||
              (!isRootSection && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "group relative flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-150 ease-in-out",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.icon && (
                  <span
                    className={cn(
                      "size-4 shrink-0 flex items-center justify-center transition-colors",
                      active ? "text-sidebar-accent-foreground" : "text-subtle-foreground group-hover:text-foreground"
                    )}
                  >
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function ShellFooter({
  user,
  isAdmin,
}: {
  user?: AppShellUser;
  isAdmin?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-sidebar-border p-4">
      {user && (
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
            {isAdmin ? (
              <Shield className="size-4" />
            ) : (
              user.name.slice(0, 1).toUpperCase()
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            {user.email ? (
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            ) : isAdmin ? (
              <p className="truncate text-xs text-muted-foreground">Super Admin</p>
            ) : null}
          </div>
          <ChevronDown className="size-4 text-subtle-foreground" />
        </div>
      )}
      {user?.onSignOut && (
        <Button
          variant="ghost"
          size="sm"
          className="justify-start rounded-lg"
          onClick={user.onSignOut}
        >
          <LogOut data-icon="inline-start" /> Sign out
        </Button>
      )}
    </div>
  );
}
