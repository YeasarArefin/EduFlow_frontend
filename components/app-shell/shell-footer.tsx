import { Button } from '@/components/ui/button';
import type { ShellFooterProps } from '@/types/app-shell';
import { ChevronDown, LogOut, Shield } from 'lucide-react';

export function ShellFooter({ user, isAdmin }: ShellFooterProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-sidebar-border p-4">
      {user && (
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
            {isAdmin ? <Shield className="size-4" /> : user.name.slice(0, 1).toUpperCase()}
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
