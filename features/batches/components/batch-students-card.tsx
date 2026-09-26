'use client';

import Link from 'next/link';
import { Archive, Calendar, Phone, Plus, RefreshCw, Search, UserMinus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SectionCard,
} from '@/components/dashboard/dashboard-primitives';
import { StatusBadge } from '@/components/status/status-badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import type { BatchStudentsCardProps, Enrollment } from '@/types/batches';
import { useDebouncedValue } from '@/utils/use-debounced-value';
import { BatchEnrollStudentSheet } from './batch-enroll-student-sheet';
import {
  useArchiveEnrollment,
  useBatchEnrollments,
  useEnrollStudent,
  useReactivateEnrollment,
  useUnenrollStudent,
} from '../queries/use-batch-enrollments';
import { formatBatchDate, formatBatchMoney, getBatchStatusVisual } from '@/utils/batch-formatters';

export function BatchStudentsCard({
  workspaceId,
  batchId,
  defaultMonthlyFeeMinor,
  batchName,
}: BatchStudentsCardProps) {
  const enrollmentsQuery = useBatchEnrollments(workspaceId, batchId);
  const enrollMutation = useEnrollStudent();
  const archiveMutation = useArchiveEnrollment();
  const reactivateMutation = useReactivateEnrollment();
  const unenrollMutation = useUnenrollStudent();

  const [enrollSheetOpen, setEnrollSheetOpen] = useState(false);
  const [searchRoster, setSearchRoster] = useState('');
  const debouncedRosterSearch = useDebouncedValue(searchRoster);
  const [archiving, setArchiving] = useState<Enrollment | null>(null);
  const [unenrolling, setUnenrolling] = useState<Enrollment | null>(null);

  const pending =
    enrollMutation.isPending ||
    archiveMutation.isPending ||
    reactivateMutation.isPending ||
    unenrollMutation.isPending;

  // Filter the current roster by search
  const filteredRoster = useMemo(() => {
    const list = enrollmentsQuery.data ?? [];
    if (!debouncedRosterSearch.trim()) return list;
    const q = debouncedRosterSearch.toLowerCase().trim();
    return list.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.studentCode.toLowerCase().includes(q) ||
        (item.phone && item.phone.includes(q))
    );
  }, [debouncedRosterSearch, enrollmentsQuery.data]);

  const activeCount = useMemo(
    () => (enrollmentsQuery.data ?? []).filter((x) => x.status === 'active').length,
    [enrollmentsQuery.data]
  );

  function handleArchive() {
    if (!archiving) return;
    archiveMutation.mutate(
      { workspaceId, batchId, id: archiving.id },
      {
        onSuccess: () => {
          toast.success(`${archiving.name} has been archived from this batch.`);
          setArchiving(null);
        },
        onError: (err: Error) => {
          toast.error(err.message || 'Could not archive enrollment.');
        },
      }
    );
  }

  function handleUnenroll() {
    if (!unenrolling) return;
    unenrollMutation.mutate(
      { workspaceId, batchId, id: unenrolling.id },
      {
        onSuccess: () => {
          toast.success(`${unenrolling.name} has been unenrolled from ${batchName}.`);
          setUnenrolling(null);
        },
        onError: (err: Error) => {
          toast.error(err.message || 'Could not unenroll student.');
        },
      }
    );
  }

  function handleReactivate(enrollment: Enrollment) {
    reactivateMutation.mutate(
      { workspaceId, batchId, id: enrollment.id },
      {
        onSuccess: () => {
          toast.success(`${enrollment.name} has been reactivated in ${batchName}.`);
        },
        onError: (err: Error) => {
          toast.error(err.message || 'Could not reactivate enrollment.');
        },
      }
    );
  }

  return (
    <SectionCard
      title="Enrolled Students"
      description="Manage active student enrollments, customized fees, and batch roster history."
      action={
        <Button onClick={() => setEnrollSheetOpen(true)} className="rounded-full shadow-sm">
          <Plus data-icon="inline-start" /> Enroll student
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Search Bar for Enrolled Students */}
        {enrollmentsQuery.data && enrollmentsQuery.data.length > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchRoster}
                onChange={(e) => setSearchRoster(e.target.value)}
                placeholder="Search enrolled students by name, code, or phone..."
                className="h-10 pl-10 rounded-full bg-input/60 border-input-border text-sm"
              />
            </div>
            <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground border border-border/60">
              {activeCount} active {activeCount === 1 ? 'student' : 'students'}
            </span>
          </div>
        ) : null}

        {enrollmentsQuery.isPending ? <LoadingState rows={3} /> : null}

        {enrollmentsQuery.isError ? (
          <ErrorState
            message="Could not load batch student enrollments."
            onRetry={() => enrollmentsQuery.refetch()}
          />
        ) : null}

        {enrollmentsQuery.isSuccess && !enrollmentsQuery.data.length ? (
          <EmptyState
            title="No students enrolled yet"
            description="Enroll an active student from your directory to begin building this batch roster."
            action={
              <Button onClick={() => setEnrollSheetOpen(true)} className="rounded-full shadow-sm">
                <Plus data-icon="inline-start" /> Enroll student
              </Button>
            }
          />
        ) : null}

        {enrollmentsQuery.isSuccess &&
        enrollmentsQuery.data.length > 0 &&
        !filteredRoster.length ? (
          <div className="rounded-2xl border border-dashed border-border/70 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No students match &ldquo;{searchRoster}&rdquo;.
            </p>
          </div>
        ) : null}

        {/* Student Roster List */}
        <div className="divide-y divide-border/40 rounded-2xl border border-border/80 bg-card/40 overflow-hidden backdrop-blur-xs">
          {filteredRoster.map((enrollment) => {
            const baseFeeMinor = enrollment.feeOverrideMinor ?? defaultMonthlyFeeMinor;
            const discountMinor = enrollment.discountMinor ?? '0';
            const netFeeMinor = Math.max(
              0,
              Number(baseFeeMinor) - Number(discountMinor)
            ).toString();

            return (
              <div
                key={enrollment.id}
                className="group flex flex-col gap-3 p-4 transition-colors hover:bg-card/80 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/workspace/students/${enrollment.studentId}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {enrollment.name}
                    </Link>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
                      {enrollment.studentCode}
                    </span>
                    <StatusBadge
                      status={getBatchStatusVisual(
                        enrollment.status === 'completed' || enrollment.status === 'cancelled'
                          ? 'archived'
                          : enrollment.status
                      )}
                    >
                      {enrollment.status}
                    </StatusBadge>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {enrollment.phone ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="size-3 text-muted-foreground" />
                        {enrollment.phone}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-3 text-muted-foreground" />
                      Joined: {formatBatchDate(enrollment.joinedAt, 'Not recorded')}
                    </span>
                  </div>

                  {/* Fee Badges & Calculation Details */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    {enrollment.feeOverrideMinor ? (
                      <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-500 border border-amber-500/20">
                        Custom Base: {formatBatchMoney(enrollment.feeOverrideMinor)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground border border-border/60">
                        Standard Base: {formatBatchMoney(defaultMonthlyFeeMinor)}
                      </span>
                    )}

                    {enrollment.discountMinor ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500 border border-emerald-500/20">
                        Discount: -{formatBatchMoney(enrollment.discountMinor)}
                      </span>
                    ) : null}

                    <span className="text-xs font-semibold text-foreground">
                      Net Monthly: {formatBatchMoney(netFeeMinor)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {enrollment.status === 'archived' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-full text-xs font-medium gap-1.5 border-border/80 hover:bg-muted/80"
                      onClick={() => handleReactivate(enrollment)}
                      disabled={pending}
                    >
                      <RefreshCw className="size-3 text-muted-foreground" />
                      Reactivate
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-full text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                      aria-label={`Archive ${enrollment.name}`}
                      title={`Archive ${enrollment.name}`}
                      onClick={() => setArchiving(enrollment)}
                      disabled={pending}
                    >
                      <Archive className="size-3.5" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    aria-label={`Unenroll ${enrollment.name}`}
                    title={`Unenroll ${enrollment.name}`}
                    onClick={() => setUnenrolling(enrollment)}
                    disabled={pending}
                  >
                    <UserMinus className="size-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enroll Student Sheet */}
      <BatchEnrollStudentSheet
        open={enrollSheetOpen}
        onOpenChange={setEnrollSheetOpen}
        workspaceId={workspaceId}
        batchId={batchId}
        batchName={batchName}
        defaultMonthlyFeeMinor={defaultMonthlyFeeMinor}
        existingEnrollments={enrollmentsQuery.data ?? []}
      />

      {/* Archive Enrollment Confirmation Dialog */}
      <AlertDialog open={Boolean(archiving)} onOpenChange={(open) => !open && setArchiving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive enrollment for {archiving?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {archiving?.name} will remain in this batch&apos;s historical tuition and attendance
              records, but will no longer be listed as an actively enrolled student.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={archiveMutation.isPending} className="rounded-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={archiveMutation.isPending}
              className="rounded-full bg-amber-600 text-white hover:bg-amber-700 font-semibold shadow-sm"
              onClick={handleArchive}
            >
              {archiveMutation.isPending && <Spinner data-icon="inline-start" />}
              Archive enrollment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unenroll Confirmation Dialog */}
      <AlertDialog
        open={Boolean(unenrolling)}
        onOpenChange={(open) => !open && setUnenrolling(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Unenroll {unenrolling?.name} from {batchName}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will completely remove {unenrolling?.name}&apos;s enrollment record from this
              batch. Use Archive if you wish to preserve historical records instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={unenrollMutation.isPending} className="rounded-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={unenrollMutation.isPending}
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold shadow-sm"
              onClick={handleUnenroll}
            >
              {unenrollMutation.isPending && <Spinner data-icon="inline-start" />}
              Unenroll student
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SectionCard>
  );
}
