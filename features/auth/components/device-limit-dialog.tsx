'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { AlertCircle, Laptop, LogOut, ShieldAlert, Smartphone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sessionTakeover } from '../api/takeover';
import type { DeviceLimitDialogProps } from '@/types/auth';

const formatDateTime = (value: string | Date) => {
  try {
    return format(new Date(value), 'PPp');
  } catch {
    return 'Unknown';
  }
};

export function DeviceLimitDialog({
  isOpen,
  onClose,
  activeSessions,
  email,
  password,
  onTakeoverSuccess,
}: DeviceLimitDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTakeover = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await sessionTakeover({ email, password });
      onTakeoverSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to log out other devices. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="max-w-md gap-5 sm:max-w-lg">
        <DialogHeader className="gap-2 text-left">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <ShieldAlert className="size-5" aria-hidden="true" />
            </div>
            <div>
              <DialogTitle>Device limit reached</DialogTitle>
              <p className="text-xs text-muted-foreground">Active session limit: 2 devices</p>
            </div>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Your account is currently signed in on the maximum number of devices. To sign in on this
            device, log out of your other active sessions.
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Currently active devices ({activeSessions.length})
          </p>
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {activeSessions.map((item) => {
              const isMobile = /Android|iOS|iPhone|iPad/i.test(item.deviceLabel || item.userAgent || '');
              const Icon = isMobile ? Smartphone : Laptop;

              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card/60 p-3 text-sm"
                >
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-medium text-foreground">
                        {item.deviceLabel || 'Unknown device'}
                      </p>
                      {item.ipAddress ? (
                        <span className="shrink-0 text-xs text-muted-foreground font-mono">
                          {item.ipAddress}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                      <span>Last active: {formatDateTime(item.lastActiveAt)}</span>
                      <span>Signed in: {formatDateTime(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleTakeover}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 size-4" />
                Logging out devices…
              </>
            ) : (
              <>
                <LogOut className="mr-2 size-4" />
                Logout all other devices
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
