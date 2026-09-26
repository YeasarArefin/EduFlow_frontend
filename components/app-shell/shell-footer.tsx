'use client';

import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useSignOut } from '@/lib/auth/sign-out';
import { formatDashboardDate, getDaysRemaining } from '@/utils/dashboard-formatters';
import type { ShellFooterProps } from '@/types/app-shell';
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronsUpDown,
  Clock,
  CreditCard,
  LogOut,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';

export function ShellFooter({ user, isAdmin, workspace, isCollapsed = false }: ShellFooterProps) {
  const router = useRouter();
  const signOut = useSignOut();

  const handleSignOut = async () => {
    if (user?.onSignOut) {
      user.onSignOut();
    } else {
      await signOut();
    }
  };

  const subscription = workspace?.subscription;
  const status = subscription?.status ?? workspace?.status ?? 'active';
  const planName = subscription?.planName || (isAdmin ? 'Platform Admin' : 'Free Trial');

  const trialDaysLeft = subscription?.trialEndsAt
    ? getDaysRemaining(subscription.trialEndsAt)
    : null;
  const expiryDaysLeft = subscription?.expiresAt ? getDaysRemaining(subscription.expiresAt) : null;

  const isTrial = status === 'trial';
  const isExpired =
    status === 'subscription_expired' ||
    status === 'expired' ||
    status === 'locked' ||
    status === 'suspended';
  const isRenewalDue = status === 'renewal_due' || status === 'payment_pending';

  const statusLabel = isTrial
    ? 'Trial'
    : isExpired
      ? 'Expired'
      : isRenewalDue
        ? 'Renewal Due'
        : 'Active';

  const statusBadgeVariant = isExpired
    ? 'destructive'
    : isTrial || isRenewalDue
      ? 'outline'
      : 'accent';

  return (
    <div className="flex flex-col border-t border-sidebar-border p-3">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'group flex w-full items-center gap-3 rounded-xl border border-sidebar-border/80 bg-sidebar/60 p-2 text-left transition-all hover:border-sidebar-border hover:bg-sidebar-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            isCollapsed && 'justify-center'
          )}
          aria-label="Workspace and account menu"
        >
          {/* Avatar / Icon */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-xs font-bold text-primary shadow-xs transition-transform group-hover:scale-105">
            {isAdmin ? (
              <Shield className="size-4.5" />
            ) : workspace?.name ? (
              workspace.name.charAt(0).toUpperCase()
            ) : user?.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              <Building2 className="size-4.5" />
            )}
          </div>

          {/* Label text */}
          <div
            className={cn(
              'min-w-0 overflow-hidden transition-[max-width,opacity] duration-200 ease-out',
              isCollapsed ? 'max-w-0 flex-none opacity-0' : 'max-w-40 flex-1 opacity-100'
            )}
            aria-hidden={isCollapsed}
          >
            <p className="truncate text-xs font-semibold text-foreground">
              {isAdmin
                ? user?.name || 'Platform Admin'
                : workspace?.name || user?.name || 'Workspace'}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              {isAdmin ? (
                <span className="truncate">Super Admin</span>
              ) : (
                <>
                  <span className="truncate max-w-[90px] font-medium">{planName}</span>
                  <span
                    className={`size-1.5 rounded-full shrink-0 ${
                      isExpired
                        ? 'bg-destructive'
                        : isTrial || isRenewalDue
                          ? 'bg-amber-500 dark:bg-amber-400 animate-pulse'
                          : 'bg-emerald-500 dark:bg-emerald-400'
                    }`}
                  />
                  <span className="capitalize">{statusLabel}</span>
                </>
              )}
            </div>
          </div>

          {/* Chevron */}
          <ChevronsUpDown
            className={cn(
              'size-4 shrink-0 text-muted-foreground/70 transition-colors group-hover:text-foreground',
              isCollapsed && 'hidden'
            )}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="top"
          align="start"
          sideOffset={8}
          className="w-72 rounded-2xl border border-border bg-popover/95 p-2 shadow-2xl backdrop-blur-xl"
        >
          {/* Workspace & Subscription Card */}
          {!isAdmin && workspace && (
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Workspace
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {workspace.name || 'Coaching Center'}
                  </p>
                </div>
                <Badge variant={statusBadgeVariant} className="text-[10px] px-2 py-0.5">
                  {statusLabel}
                </Badge>
              </div>

              {/* Subscription details box */}
              <div className="space-y-1.5 border-t border-border/40 pt-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-primary" />
                    Plan
                  </span>
                  <span className="font-semibold text-foreground">{planName}</span>
                </div>

                {isTrial && subscription?.trialEndsAt && (
                  <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      Trial ends
                    </span>
                    <span className="font-medium">
                      {formatDashboardDate(subscription.trialEndsAt)}
                      {trialDaysLeft !== null ? ` (${trialDaysLeft}d)` : ''}
                    </span>
                  </div>
                )}

                {!isTrial && subscription?.expiresAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      Expires
                    </span>
                    <span className="font-medium text-foreground">
                      {formatDashboardDate(subscription.expiresAt)}
                      {expiryDaysLeft !== null && expiryDaysLeft <= 30
                        ? ` (${expiryDaysLeft}d)`
                        : ''}
                    </span>
                  </div>
                )}

                {subscription?.renewalDueAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      Renewal
                    </span>
                    <span className="font-medium text-foreground">
                      {formatDashboardDate(subscription.renewalDueAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Management Links */}
          {!isAdmin && (
            <DropdownMenuGroup className="py-1">
              <DropdownMenuItem
                className="cursor-pointer gap-2.5 rounded-lg py-2 text-xs font-medium"
                onClick={() => router.push('/workspace/settings')}
              >
                <Settings className="size-4 text-muted-foreground" />
                <span>Workspace Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2.5 rounded-lg py-2 text-xs font-medium"
                onClick={() => router.push('/workspace/staff')}
              >
                <ShieldCheck className="size-4 text-muted-foreground" />
                <span>Staff & Permissions</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2.5 rounded-lg py-2 text-xs font-medium"
                onClick={() => router.push('/workspace/dashboard')}
              >
                <CreditCard className="size-4 text-muted-foreground" />
                <span>Overview & Finance</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}

          <DropdownMenuSeparator />

          {/* User Details */}
          {user && (
            <div className="px-2 py-1.5">
              <p className="truncate text-xs font-semibold text-foreground">{user.name}</p>
              {user.email && (
                <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
              )}
            </div>
          )}

          {/* Sign Out */}
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer gap-2.5 rounded-lg py-2 text-xs font-medium"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
