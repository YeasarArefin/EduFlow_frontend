'use client';

import { ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type {
  PlatformLifecycleOperationConfig,
  PlatformSubscriptionLifecycleOperation,
  PlatformWorkspaceDetail,
} from '@/types/platform';
import { useRunPlatformSubscriptionLifecycleOperation } from '../mutations/use-subscription-lifecycle';

const lifecycleOperationConfigs: Record<
  PlatformSubscriptionLifecycleOperation,
  PlatformLifecycleOperationConfig
> = {
  'renewal-due': {
    operation: 'renewal-due',
    label: 'Mark renewal due',
    title: 'Mark this subscription as renewal due?',
    description:
      'This records that the renewal deadline has passed. The backend will verify the current subscription timeline.',
    confirmLabel: 'Mark renewal due',
  },
  expire: {
    operation: 'expire',
    label: 'Expire subscription',
    title: 'Expire this subscription?',
    description:
      'This ends the current subscription period. The backend will verify that expiry is due before applying the change.',
    confirmLabel: 'Expire subscription',
    destructive: true,
  },
  lock: {
    operation: 'lock',
    label: 'Lock workspace',
    title: 'Lock this workspace?',
    description:
      'Members will lose workspace access until it is unlocked with a valid subscription.',
    confirmLabel: 'Lock workspace',
    destructive: true,
  },
  unlock: {
    operation: 'unlock',
    label: 'Unlock workspace',
    title: 'Unlock this workspace?',
    description:
      'Members will regain access only when the backend confirms the subscription is valid.',
    confirmLabel: 'Unlock workspace',
  },
  'schedule-deletion': {
    operation: 'schedule-deletion',
    label: 'Schedule deletion',
    title: 'Schedule workspace deletion?',
    description:
      'The workspace stays locked until the selected future deletion date. This does not erase its subscription or payment history.',
    confirmLabel: 'Schedule deletion',
    destructive: true,
  },
};

function lifecycleActions(detail: PlatformWorkspaceDetail) {
  const { workspace, subscription } = detail;
  const actions: PlatformSubscriptionLifecycleOperation[] = [];

  if (subscription?.status === 'active') actions.push('renewal-due');
  if (subscription?.status === 'renewal_due') actions.push('expire');
  if (workspace.status === 'active' && subscription?.status === 'expired') actions.push('lock');
  if (
    workspace.status === 'locked' &&
    subscription &&
    ['trial', 'active', 'renewal_due'].includes(subscription.status)
  ) {
    actions.push('unlock');
  }
  if (workspace.status === 'locked') actions.push('schedule-deletion');

  return actions;
}

function LifecycleActionDialog({
  config,
  isPending,
  onRun,
}: {
  config: PlatformLifecycleOperationConfig;
  isPending: boolean;
  onRun: (operation: PlatformSubscriptionLifecycleOperation, scheduledDeleteAt?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [scheduledDeleteAt, setScheduledDeleteAt] = useState('');
  const [dateError, setDateError] = useState<string | null>(null);
  const requiresDeletionDate = config.operation === 'schedule-deletion';

  function submit() {
    if (requiresDeletionDate) {
      const deletionDate = new Date(scheduledDeleteAt);
      if (
        !scheduledDeleteAt ||
        Number.isNaN(deletionDate.getTime()) ||
        deletionDate <= new Date()
      ) {
        setDateError('Choose a future deletion date.');
        return;
      }
    }

    onRun(
      config.operation,
      requiresDeletionDate ? new Date(scheduledDeleteAt).toISOString() : undefined
    );
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            size="sm"
            variant={config.destructive ? 'destructive' : 'outline'}
            className="rounded-full"
            disabled={isPending}
          />
        }
      >
        {config.label}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{config.title}</AlertDialogTitle>
          <AlertDialogDescription>{config.description}</AlertDialogDescription>
        </AlertDialogHeader>
        {requiresDeletionDate ? (
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Deletion date
            <Input
              type="date"
              value={scheduledDeleteAt}
              aria-invalid={Boolean(dateError)}
              aria-describedby={dateError ? 'scheduled-delete-at-error' : undefined}
              onChange={(event) => {
                setScheduledDeleteAt(event.target.value);
                setDateError(null);
              }}
            />
            {dateError ? (
              <span id="scheduled-delete-at-error" className="text-sm font-normal text-destructive">
                {dateError}
              </span>
            ) : null}
          </label>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={config.destructive ? 'destructive' : 'default'}
            disabled={isPending}
            onClick={submit}
          >
            {isPending ? 'Updating…' : config.confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function WorkspaceSubscriptionLifecycleControls({
  detail,
}: {
  detail: PlatformWorkspaceDetail;
}) {
  const mutation = useRunPlatformSubscriptionLifecycleOperation();
  const actions = lifecycleActions(detail);

  return (
    <div className="flex flex-col gap-4">
      {actions.length ? (
        <div className="flex flex-wrap gap-2">
          {actions.map((operation) => (
            <LifecycleActionDialog
              key={operation}
              config={lifecycleOperationConfigs[operation]}
              isPending={mutation.isPending}
              onRun={(nextOperation, scheduledDeleteAt) =>
                mutation.mutate({
                  workspaceId: detail.workspace.id,
                  operation: nextOperation,
                  scheduledDeleteAt,
                })
              }
            />
          ))}
        </div>
      ) : (
        <Alert>
          <ShieldAlert />
          <AlertTitle>No lifecycle action is available</AlertTitle>
          <AlertDescription>
            The current workspace and subscription state do not offer an administrative lifecycle
            action.
          </AlertDescription>
        </Alert>
      )}
      <p className="text-sm text-muted-foreground">
        Actions are based on the current state. The server validates the final transition and
        refreshes this view if the state has changed.
      </p>
    </div>
  );
}
