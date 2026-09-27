'use client';

import { Button } from '@/components/ui/button';
import { useSignOut } from '@/lib/auth/sign-out';
import { LogOut, Shield } from 'lucide-react';

export function PublicAccount({
  name,
  isAdmin = false,
}: {
  name?: string | null;
  isAdmin?: boolean;
}) {
  const signOut = useSignOut();
  const displayName = name || 'Account';
  const initial = displayName.slice(0, 1).toUpperCase();

  return (
    <div className="flex items-center gap-1.5 rounded-full bg-surface-soft py-1 pl-1 pr-1.5 transition-colors">
      <span
        className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
        aria-hidden="true"
      >
        {isAdmin ? <Shield className="size-3.5" /> : initial}
      </span>
      <span className="max-w-28 truncate text-xs font-medium text-foreground px-1.5">
        {displayName}
      </span>
      <Button
        variant="ghost"
        size="icon-xs"
        className="size-6 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        title="Sign out"
        aria-label="Sign out"
        onClick={signOut}
      >
        <LogOut className="size-3" />
      </Button>
    </div>
  );
}
