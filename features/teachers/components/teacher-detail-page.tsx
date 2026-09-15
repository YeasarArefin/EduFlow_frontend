'use client';

import { ErrorState, LoadingState, SectionCard } from '@/components/dashboard/dashboard-primitives';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useBatchesQuery } from '@/features/batches/queries/use-batches-query';
import { useSalaries } from '@/features/salaries/queries/use-salaries';
import { cn } from '@/lib/utils';
import type { Salary, SalaryStatus } from '@/types/salaries';
import type { TeacherDetailPageProps } from '@/types/teachers';
import {
  Archive,
  BookOpen,
  Calendar,
  ChevronLeft,
  Clock,
  Coins,
  CreditCard,
  Eye,
  GraduationCap,
  Mail,
  Pencil,
  Phone,
  RefreshCw,
  UserCheck,
  UserX,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  useArchiveTeacherMutation,
  useUpdateTeacherMutation,
} from '../mutations/use-teacher-mutations';
import { useTeacherQuery } from '../queries/use-teachers-query';
import { TeacherProfileSection } from './teacher-profile-section';
import { TeacherSheet } from './teacher-sheet';
import {
  formatTeacherSalaryMinor,
  getTeacherInitials,
  getTeacherStatusVisual,
} from '@/utils/teacher-formatters';

const DAYS_MAP: Record<number, string> = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

const salaryStatusLabels: Record<SalaryStatus, string> = {
  pending: 'Pending',
  partially_paid: 'Partially Paid',
  paid: 'Paid',
  overdue: 'Overdue',
  waived: 'Waived',
};

const salaryStatusVisuals: Record<SalaryStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  paid: 'success',
  partially_paid: 'warning',
  overdue: 'danger',
  pending: 'info',
  waived: 'info',
};

function formatTaka(amount?: string | number | null): string {
  if (amount === undefined || amount === null || amount === '') return '৳0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '৳0.00';
  return `৳${num.toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatMonth(dateStr?: string | null): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-BD', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  } catch {
    return dateStr;
  }
}

export function TeacherDetailPage({ workspaceId, teacherId }: TeacherDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'batches' | 'salaries' | 'profile'>('batches');
  const [editOpen, setEditOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);

  const teacherQuery = useTeacherQuery(workspaceId, teacherId);
  const batchesQuery = useBatchesQuery(workspaceId, {
    page: 1,
    limit: 100,
    status: 'active',
  });
  const salariesQuery = useSalaries(workspaceId, {
    page: 1,
    limit: 100,
  });

  const archiveMutation = useArchiveTeacherMutation();
  const updateMutation = useUpdateTeacherMutation();

  const teacher = teacherQuery.data;
  const isArchived = teacher?.status === 'archived';
  const statusVisual = teacher ? getTeacherStatusVisual(teacher.status) : null;

  // Filter salary ledger records for this specific instructor
  const teacherSalaries = useMemo(() => {
    const allSalaries = (salariesQuery.data?.data as Salary[] | undefined) ?? [];
    return allSalaries.filter(
      (s) => s.teacherId === teacherId || s.teacher?.id === teacherId
    );
  }, [salariesQuery.data, teacherId]);

  // Aggregate financial metrics for teacher
  const salaryTotals = useMemo(() => {
    let billed = 0;
    let paid = 0;
    let due = 0;
    for (const s of teacherSalaries) {
      const exp = parseFloat(s.expectedSalary || '0');
      const adj = parseFloat(s.adjustmentAmount || '0');
      const p = parseFloat(s.paidAmount || '0');
      const d = parseFloat(s.dueAmount || '0');
      billed += Math.max(0, exp + adj);
      paid += p;
      due += d;
    }
    return {
      totalExpected: billed,
      totalPaid: paid,
      totalDue: due,
    };
  }, [teacherSalaries]);

  const batches = useMemo(() => batchesQuery.data?.data ?? [], [batchesQuery.data?.data]);

  if (teacherQuery.isPending) return <LoadingState rows={6} />;
  if (teacherQuery.isError || !teacher || !statusVisual) {
    return (
      <ErrorState
        message="Could not load this teacher record. It may have been deleted or moved."
        onRetry={() => teacherQuery.refetch()}
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Top Back Navigation Strip */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/dashboard/teachers" />}
          className="rounded-full shadow-xs"
        >
          <ChevronLeft data-icon="inline-start" /> Back to Teachers
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="rounded-full shadow-xs"
          >
            <Pencil data-icon="inline-start" /> Edit Profile
          </Button>
          <Button
            variant={isArchived ? 'outline' : 'destructive'}
            size="sm"
            onClick={() => setArchiveOpen(true)}
            className="rounded-full shadow-xs"
          >
            {isArchived ? (
              <>
                <RefreshCw data-icon="inline-start" /> Reactivate
              </>
            ) : (
              <>
                <Archive data-icon="inline-start" /> Archive
              </>
            )}
          </Button>
        </div>
      </div>

      {/* StyleOrbit Glass Hero Profile Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Identity & Main Info */}
          <div className="flex items-start gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-lime-500/30 bg-lime-500/10 font-heading text-xl font-bold text-lime-400 shadow-inner">
              {getTeacherInitials(teacher.name)}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {teacher.name}
                </h1>
                <StatusBadge status={statusVisual.tone}>{statusVisual.label}</StatusBadge>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground">
                  {teacher.teacherCode}
                </span>

                {teacher.phone && (
                  <span className="inline-flex items-center gap-1">
                    • <Phone className="size-3 text-muted-foreground" />
                    <a
                      href={`tel:${teacher.phone}`}
                      className="font-mono text-foreground hover:underline"
                    >
                      {teacher.phone}
                    </a>
                  </span>
                )}

                {teacher.email && (
                  <span className="inline-flex items-center gap-1">
                    • <Mail className="size-3 text-muted-foreground" />
                    <a
                      href={`mailto:${teacher.email}`}
                      className="text-foreground hover:underline"
                    >
                      {teacher.email}
                    </a>
                  </span>
                )}

                <span className="inline-flex items-center gap-1">
                  • <BookOpen className="size-3 text-muted-foreground" />
                  <span>{teacher.subjectSpecialty || 'General Instructor'}</span>
                </span>

                <span className="inline-flex items-center gap-1">
                  • <Wallet className="size-3 text-muted-foreground" />
                  <span className="font-mono font-medium text-foreground">
                    {formatTeacherSalaryMinor(teacher.defaultSalaryMinor)} / mo
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Hero Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/dashboard/salaries" />}
              className="rounded-full shadow-xs"
            >
              <Coins data-icon="inline-start" /> View Salary Payroll
            </Button>
          </div>
        </div>
      </div>

      {/* Top 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Base Monthly Salary */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Base Salary Rate</span>
            <Wallet className="size-4 text-lime-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold tracking-tight text-foreground">
            {formatTeacherSalaryMinor(teacher.defaultSalaryMinor)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Default monthly contract compensation</p>
        </div>

        {/* Specialization */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Specialization</span>
            <BookOpen className="size-4 text-lime-400" />
          </div>
          <div className="mt-2 truncate text-2xl font-bold tracking-tight text-foreground">
            {teacher.subjectSpecialty || 'General'}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Primary instructional domain</p>
        </div>

        {/* Status */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Instructor Status</span>
            {teacher.status === 'active' ? (
              <UserCheck className="size-4 text-emerald-400" />
            ) : (
              <UserX className="size-4 text-amber-400" />
            )}
          </div>
          <div
            className={cn(
              'mt-2 text-2xl font-bold tracking-tight',
              teacher.status === 'active'
                ? 'text-emerald-400'
                : teacher.status === 'inactive'
                  ? 'text-amber-400'
                  : 'text-muted-foreground'
            )}
          >
            {statusVisual.label}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Workspace faculty availability</p>
        </div>

        {/* Teacher Code */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Teacher Code</span>
            <GraduationCap className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold tracking-tight text-foreground">
            {teacher.teacherCode}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Institutional faculty ID</p>
        </div>
      </div>

      {/* Tabs Header Navigation */}
      <nav
        className="w-full overflow-x-auto border-b border-border"
        aria-label="Teacher profile sections"
      >
        <div className="flex min-w-max gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('batches')}
            className={cn(
              'flex cursor-pointer items-center gap-2 h-10 border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 -mb-[1px]',
              activeTab === 'batches'
                ? 'border-primary font-semibold text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <BookOpen className="size-4" />
            Assigned Batches & Classes
            <span
              className={cn(
                'rounded-full px-2 py-0.5 font-mono text-xs font-medium',
                activeTab === 'batches'
                  ? 'border border-primary/30 bg-primary/20 text-primary'
                  : 'border border-border/50 bg-muted text-muted-foreground'
              )}
            >
              {batches.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('salaries')}
            className={cn(
              'flex cursor-pointer items-center gap-2 h-10 border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 -mb-[1px]',
              activeTab === 'salaries'
                ? 'border-primary font-semibold text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <CreditCard className="size-4" />
            Salary & Compensation Ledger
            <span
              className={cn(
                'rounded-full px-2 py-0.5 font-mono text-xs font-medium',
                activeTab === 'salaries'
                  ? 'border border-primary/30 bg-primary/20 text-primary'
                  : 'border border-border/50 bg-muted text-muted-foreground'
              )}
            >
              {teacherSalaries.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={cn(
              'flex cursor-pointer items-center gap-2 h-10 border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 -mb-[1px]',
              activeTab === 'profile'
                ? 'border-primary font-semibold text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <GraduationCap className="size-4" />
            Teacher Profile & Info
          </button>
        </div>
      </nav>

      {/* Tab 1: Assigned Batches & Classes */}
      {activeTab === 'batches' && (
        <div className="space-y-4">
          <SectionCard
            title="Coaching Batches & Class Schedule"
            description="Active coaching batches in this workspace available for instructional scheduling and teaching."
            action={
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/dashboard/batches" />}
                className="rounded-full shadow-xs"
              >
                <BookOpen data-icon="inline-start" /> Manage Batches
              </Button>
            }
          >
            {batchesQuery.isPending ? (
              <LoadingState rows={4} />
            ) : batchesQuery.isError ? (
              <ErrorState
                message="Could not load batch assignments."
                onRetry={() => batchesQuery.refetch()}
              />
            ) : batches.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-muted-foreground">
                <BookOpen className="mx-auto mb-2 size-8 opacity-40" />
                <p className="text-sm font-medium text-foreground">No active batches found</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Create batches in the Batches module to assign teachers to coaching groups.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href="/dashboard/batches" />}
                  className="mt-4 rounded-full"
                >
                  Go to Batches
                </Button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {batches.map((batch) => (
                  <div
                    key={batch.id}
                    className="flex flex-col justify-between space-y-3 rounded-2xl border border-border/70 bg-card/40 p-4 transition-colors hover:border-border"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{batch.name}</h4>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                          {batch.classLevel && (
                            <span className="rounded-md border border-border/60 bg-muted/30 px-1.5 py-0.5 text-[11px] font-medium text-foreground">
                              {batch.classLevel.name}
                            </span>
                          )}
                          {batch.medium && (
                            <span className="rounded-md border border-border/60 bg-muted/30 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                              {batch.medium.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={batch.status === 'active' ? 'success' : 'info'}>
                        {batch.status}
                      </StatusBadge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-border/40 pt-2.5 text-xs text-muted-foreground">
                      <div>
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar className="size-3" /> Class Days
                        </span>
                        <div className="mt-0.5 flex flex-wrap gap-1">
                          {batch.classDays?.length ? (
                            batch.classDays.map((d) => (
                              <span
                                key={d}
                                className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-foreground"
                              >
                                {DAYS_MAP[d] ?? d}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted-foreground">Flexible</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="flex items-center gap-1 text-[11px]">
                          <Clock className="size-3" /> Monthly Fee
                        </span>
                        <span className="mt-0.5 block font-mono font-medium text-foreground">
                          {formatTeacherSalaryMinor(batch.monthlyFeeMinor)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end border-t border-border/30 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        render={<Link href={`/dashboard/batches/${batch.id}`} />}
                        className="h-7 rounded-full px-2.5 text-xs"
                      >
                        <Eye className="size-3" /> View Batch
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* Tab 2: Salary & Compensation Ledger */}
      {activeTab === 'salaries' && (
        <div className="space-y-4">
          <SectionCard
            title="Teacher Compensation History"
            description="Monthly salary payroll disbursements, adjustments, and settlement history for this instructor."
            action={
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/dashboard/salaries" />}
                className="rounded-full shadow-xs"
              >
                <Coins data-icon="inline-start" /> Open Salary Payroll
              </Button>
            }
          >
            {salariesQuery.isPending ? (
              <LoadingState rows={4} />
            ) : salariesQuery.isError ? (
              <ErrorState
                message="Could not load salary history for this teacher."
                onRetry={() => salariesQuery.refetch()}
              />
            ) : teacherSalaries.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/60 p-10 text-center text-muted-foreground">
                <Coins className="mx-auto mb-3 size-10 opacity-40" />
                <p className="text-base font-semibold text-foreground">
                  No monthly salary disbursements recorded
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Monthly payroll records will appear here after salaries are generated from the
                  Salary Management module.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href="/dashboard/salaries" />}
                  className="mt-4 rounded-full"
                >
                  Go to Salary Management
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border/60">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/60 bg-muted/20 hover:bg-muted/20">
                      <TableHead className="w-[130px] font-medium text-foreground">
                        Salary Month
                      </TableHead>
                      <TableHead className="text-right font-medium text-foreground">
                        Base / Expected
                      </TableHead>
                      <TableHead className="text-right font-medium text-foreground">
                        Adjustments
                      </TableHead>
                      <TableHead className="text-right font-medium text-foreground">
                        Paid Amount
                      </TableHead>
                      <TableHead className="text-right font-medium text-foreground">
                        Due Balance
                      </TableHead>
                      <TableHead className="text-center font-medium text-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-right font-medium text-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherSalaries.map((salary: Salary) => {
                      const dueNum = parseFloat(salary.dueAmount || '0');
                      const statusKey = salary.status;

                      return (
                        <TableRow
                          key={salary.id}
                          className="border-border/40 transition-colors hover:bg-muted/20"
                        >
                          <TableCell className="font-medium text-foreground">
                            {formatMonth(salary.salaryMonth)}
                          </TableCell>

                          <TableCell className="text-right font-mono text-xs text-foreground">
                            {formatTaka(salary.expectedSalary)}
                          </TableCell>

                          <TableCell className="text-right font-mono text-xs text-muted-foreground">
                            {parseFloat(salary.adjustmentAmount || '0') !== 0 ? (
                              <span
                                className={
                                  parseFloat(salary.adjustmentAmount) > 0
                                    ? 'text-emerald-400'
                                    : 'text-rose-400'
                                }
                              >
                                {formatTaka(salary.adjustmentAmount)}
                              </span>
                            ) : (
                              '—'
                            )}
                          </TableCell>

                          <TableCell className="text-right font-mono text-xs font-semibold text-emerald-400">
                            {formatTaka(salary.paidAmount)}
                          </TableCell>

                          <TableCell className="text-right font-mono text-xs font-bold">
                            <span
                              className={dueNum > 0 ? 'text-amber-400' : 'text-muted-foreground'}
                            >
                              {formatTaka(salary.dueAmount)}
                            </span>
                          </TableCell>

                          <TableCell className="text-center">
                            <StatusBadge status={salaryStatusVisuals[statusKey] || 'info'}>
                              {salaryStatusLabels[statusKey] || salary.status}
                            </StatusBadge>
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              render={<Link href="/dashboard/salaries" />}
                              className="h-7 rounded-full px-2.5 text-xs"
                            >
                              <Eye className="size-3" />
                              View Payroll
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* Tab 3: Teacher Profile & Info */}
      {activeTab === 'profile' && <TeacherProfileSection teacher={teacher} />}

      {/* Edit Teacher Modal */}
      <TeacherSheet
        key={editOpen ? 'edit-open' : 'edit-closed'}
        open={editOpen}
        onOpenChange={setEditOpen}
        workspaceId={workspaceId}
        teacher={teacher}
      />

      {/* Archive / Reactivate Confirmation Dialog */}
      <AlertDialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isArchived ? 'Reactivate teacher profile?' : 'Archive this teacher?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isArchived
                ? `This will restore ${teacher.name}'s profile to active status in this workspace.`
                : `This will mark ${teacher.name} as archived. Existing historical assignments and salary records will be preserved.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={isArchived ? 'default' : 'destructive'}
              onClick={() => {
                if (isArchived) {
                  updateMutation.mutate(
                    { workspaceId, id: teacher.id, input: { status: 'active' } },
                    { onSuccess: () => setArchiveOpen(false) }
                  );
                } else {
                  archiveMutation.mutate(
                    { workspaceId, id: teacher.id },
                    { onSuccess: () => setArchiveOpen(false) }
                  );
                }
              }}
            >
              {isArchived ? 'Reactivate' : 'Archive'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
