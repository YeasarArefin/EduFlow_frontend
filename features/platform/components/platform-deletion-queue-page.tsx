'use client';

import Link from 'next/link';
import { ExternalLink, LockKeyhole, Unlock } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  DataTable,
  EmptyState,
  ErrorState,
  FilterToolbar,
  LoadingState,
  PageHeader,
  Pagination,
} from '@/components/dashboard-primitives';
import { StatusBadge } from '@/components/status-badge';
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
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PlatformWorkspace, PlatformWorkspaceListParams } from '../api/workspaces';
import { useRunPlatformSubscriptionLifecycleOperation } from '../hooks/use-subscription-lifecycle';
import { usePlatformWorkspaces } from '../hooks/use-workspaces';

const PAGE_SIZE = 20;
const queueFilters = [
  { value: 'all', label: 'Locked + scheduled' },
  { value: 'locked', label: 'Locked only' },
  { value: 'scheduled_deletion', label: 'Scheduled deletion only' },
] as const;
type QueueFilter = (typeof queueFilters)[number]['value'];

const workspaceLabels = {
  locked: 'Locked',
  scheduled_deletion: 'Scheduled for deletion',
} as const;

const accessLabels = {
  locked: 'Locked',
  scheduled_for_deletion: 'Scheduled for deletion',
} as const;

function getPositivePage(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function getQueueFilter(value: string | null): QueueFilter {
  return queueFilters.some((filter) => filter.value === value) ? (value as QueueFilter) : 'all';
}

function formatDate(value: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
    date
  );
}

function RecoveryActions({ workspace }: { workspace: PlatformWorkspace }) {
  const mutation = useRunPlatformSubscriptionLifecycleOperation();
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduledDeleteAt, setScheduledDeleteAt] = useState('');
  const [dateError, setDateError] = useState<string>();
  const canUnlock =
    workspace.workspaceStatus === 'locked' &&
    Boolean(
      workspace.subscription &&
      ['trial', 'active', 'renewal_due'].includes(workspace.subscription.status)
    );
  const canScheduleDeletion = workspace.workspaceStatus === 'locked';

  function runUnlock() {
    mutation.mutate(
      { workspaceId: workspace.id, operation: 'unlock' },
      { onSuccess: () => setUnlockOpen(false) }
    );
  }

  function runScheduleDeletion() {
    const date = new Date(scheduledDeleteAt);
    if (!scheduledDeleteAt || Number.isNaN(date.getTime()) || date <= new Date()) {
      setDateError('Choose a future deletion date.');
      return;
    }
    mutation.mutate(
      {
        workspaceId: workspace.id,
        operation: 'schedule-deletion',
        scheduledDeleteAt: date.toISOString(),
      },
      { onSuccess: () => setScheduleOpen(false) }
    );
  }

  if (!canUnlock && !canScheduleDeletion)
    return <span className="text-sm text-muted-foreground">No recovery action</span>;

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {canUnlock ? (
        <AlertDialog open={unlockOpen} onOpenChange={setUnlockOpen}>
          <AlertDialogTrigger
            render={
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                disabled={mutation.isPending}
              />
            }
          >
            <Unlock data-icon="inline-start" /> Unlock
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unlock this workspace?</AlertDialogTitle>
              <AlertDialogDescription>
                Members regain access only if the backend confirms that its current subscription is
                valid.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={mutation.isPending} onClick={runUnlock}>
                {mutation.isPending ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <Unlock data-icon="inline-start" />
                )}{' '}
                Unlock workspace
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
      {canScheduleDeletion ? (
        <AlertDialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
          <AlertDialogTrigger
            render={
              <Button
                size="sm"
                variant="destructive"
                className="rounded-full"
                disabled={mutation.isPending}
              />
            }
          >
            <LockKeyhole data-icon="inline-start" /> Schedule deletion
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Schedule workspace deletion?</AlertDialogTitle>
              <AlertDialogDescription>
                This keeps the workspace locked until the selected date. No data, payment, or
                subscription history is deleted by this action.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Field data-invalid={Boolean(dateError)}>
              <FieldLabel htmlFor={`deletion-date-${workspace.id}`}>Deletion date</FieldLabel>
              <Input
                id={`deletion-date-${workspace.id}`}
                type="date"
                value={scheduledDeleteAt}
                aria-invalid={Boolean(dateError)}
                onChange={(event) => {
                  setScheduledDeleteAt(event.target.value);
                  setDateError(undefined);
                }}
              />
              <FieldError>{dateError}</FieldError>
            </Field>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={mutation.isPending}
                onClick={runScheduleDeletion}
              >
                {mutation.isPending ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <LockKeyhole data-icon="inline-start" />
                )}{' '}
                Schedule deletion
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </div>
  );
}

export function PlatformDeletionQueuePage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queueFilter = getQueueFilter(searchParams.get('state'));
  const params = useMemo<PlatformWorkspaceListParams>(
    () => ({
      page: getPositivePage(searchParams.get('page')),
      limit: PAGE_SIZE,
      search: searchParams.get('search') || undefined,
      lifecycleQueue: queueFilter === 'all',
      workspaceStatus: queueFilter === 'all' ? undefined : queueFilter,
    }),
    [queueFilter, searchParams]
  );
  const query = usePlatformWorkspaces(params);
  const workspaces = query.data?.data ?? [];
  const meta = query.data?.meta;

  function updateUrl(updates: Record<string, string | undefined>) {
    const nextParams = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) =>
      value ? nextParams.set(key, value) : nextParams.delete(key)
    );
    const queryString = nextParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Locked & deletion queue"
        description="Review blocked workspaces, recover valid access, and track scheduled deletion dates."
      />
      <FilterToolbar
        placeholder="Search by workspace name or identifier"
        searchValue={params.search}
        onSearch={(search) => updateUrl({ search: search || undefined, page: undefined })}
      >
        <Select
          items={queueFilters.map((item) => ({ label: item.label, value: item.value }))}
          value={queueFilter}
          onValueChange={(state) =>
            updateUrl({
              state: state === 'all' ? undefined : (state ?? undefined),
              page: undefined,
            })
          }
        >
          <SelectTrigger aria-label="Filter the deletion queue">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {queueFilters.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FilterToolbar>

      {query.isPending ? <LoadingState rows={6} /> : null}
      {query.isError ? (
        <ErrorState
          message="Could not load the locked and deletion queue. Please try again."
          onRetry={() => query.refetch()}
        />
      ) : null}
      {query.isSuccess && workspaces.length === 0 ? (
        <EmptyState
          title="No risky workspaces"
          description="Locked workspaces and scheduled deletions will appear here when they need attention."
        />
      ) : null}
      {query.isSuccess && workspaces.length ? (
        <div className="flex flex-col gap-4">
          <DataTable>
            <TableHeader>
              <TableRow>
                <TableHead>Workspace</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Access / subscription</TableHead>
                <TableHead>Locked</TableHead>
                <TableHead>Deletion date</TableHead>
                <TableHead>Context</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspaces.map((workspace) => (
                <TableRow key={workspace.id}>
                  <TableCell className="min-w-48">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{workspace.name ?? 'Untitled workspace'}</span>
                      <span className="text-xs text-muted-foreground">
                        {workspace.slug ?? workspace.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{workspace.subscription?.plan?.name ?? 'No plan'}</TableCell>
                  <TableCell>
                    <div className="flex min-w-36 flex-col gap-1.5">
                      <StatusBadge
                        status={
                          workspace.workspaceStatus === 'scheduled_deletion' ? 'warning' : 'danger'
                        }
                      >
                        {workspaceLabels[
                          workspace.workspaceStatus as keyof typeof workspaceLabels
                        ] ?? workspace.workspaceStatus}
                      </StatusBadge>
                      <StatusBadge
                        status={
                          workspace.access.status === 'scheduled_for_deletion'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {accessLabels[workspace.access.status as keyof typeof accessLabels] ??
                          workspace.access.status}
                      </StatusBadge>
                      {workspace.subscription ? (
                        <span className="text-xs text-muted-foreground">
                          Subscription: {workspace.subscription.status.replace('_', ' ')}
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDate(workspace.lockedAt)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDate(workspace.scheduledDeleteAt)}
                  </TableCell>
                  <TableCell className="min-w-56 max-w-80 text-sm text-muted-foreground">
                    {workspace.access.reason}
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-44 flex-col items-end gap-2">
                      <RecoveryActions workspace={workspace} />
                      <Button
                        variant="ghost"
                        size="sm"
                        render={<Link href={`/platform/workspaces/${workspace.id}`} />}
                      >
                        <ExternalLink data-icon="inline-start" /> Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
          <Pagination
            page={meta?.page ?? params.page}
            pageCount={Math.max(meta?.totalPages ?? 1, 1)}
            onPageChange={(page) => updateUrl({ page: page === 1 ? undefined : String(page) })}
          />
        </div>
      ) : null}
    </div>
  );
}
