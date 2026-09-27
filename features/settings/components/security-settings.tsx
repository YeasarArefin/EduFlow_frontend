'use client';

import { format } from 'date-fns';
import { Laptop, LogOut, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionCard } from '@/components/dashboard/dashboard-primitives';
import { signOut } from '@/lib/auth/client';
import { useRevokeOtherSessions, useRevokeSession } from '../mutations/use-session-mutations';
import { useActiveSessions } from '../queries/use-active-sessions';
import { ChangePasswordCard } from './change-password-card';

const dateTime = (value: string) => format(new Date(value), 'PPp');

export function SecuritySettings() {
  const router = useRouter();
  const sessions = useActiveSessions();
  const revoke = useRevokeSession();
  const revokeOthers = useRevokeOtherSessions();

  async function logOutCurrent() {
    await signOut();
    router.replace('/signin');
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <ChangePasswordCard />
      <SectionCard
        title="Active sessions"
        description="Review devices signed in to your account and remove any you no longer recognize."
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Revoking a session signs that device out on its next request.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() =>
              revokeOthers.mutate(undefined, {
                onSuccess: () => toast.success('Other sessions logged out.'),
                onError: (error) => toast.error(error.message),
              })
            }
            disabled={
              revokeOthers.isPending ||
              sessions.data?.filter((item) => !item.isCurrent).length === 0
            }
          >
            <LogOut /> {revokeOthers.isPending ? 'Logging out…' : 'Log out all other sessions'}
          </Button>
        </div>
        {sessions.isPending ? (
          <p className="text-sm text-muted-foreground">Loading active sessions…</p>
        ) : null}
        {sessions.isError ? (
          <p className="text-sm text-destructive">
            Could not load active sessions. Please try again.
          </p>
        ) : null}
        <div className="grid gap-3">
          {sessions.data?.map((item) => (
            <article key={item.id} className="rounded-lg border border-border bg-card/70 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  <Laptop
                    className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium text-foreground">{item.deviceLabel}</h3>
                      {item.isCurrent ? <Badge>Current session</Badge> : null}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.ipAddress ?? 'IP unavailable'}
                    </p>
                    <dl className="mt-3 grid gap-x-5 gap-y-1 text-xs text-muted-foreground sm:grid-cols-3">
                      <div>
                        <dt>Signed in</dt>
                        <dd className="text-foreground">{dateTime(item.createdAt)}</dd>
                      </div>
                      <div>
                        <dt>Last active</dt>
                        <dd className="text-foreground">{dateTime(item.lastActiveAt)}</dd>
                      </div>
                      <div>
                        <dt>Expires</dt>
                        <dd className="text-foreground">{dateTime(item.expiresAt)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <Button
                  variant={item.isCurrent ? 'destructive' : 'outline'}
                  onClick={() =>
                    item.isCurrent
                      ? void logOutCurrent()
                      : revoke.mutate(item.id, {
                          onSuccess: () => toast.success('Session logged out.'),
                          onError: (error) => toast.error(error.message),
                        })
                  }
                  disabled={revoke.isPending}
                >
                  {item.isCurrent ? 'Log out' : 'Log out'}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
