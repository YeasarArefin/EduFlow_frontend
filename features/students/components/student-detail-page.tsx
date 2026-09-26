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
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEnrollStudent } from '@/features/batches/queries/use-batch-enrollments';
import { useBatchesQuery } from '@/features/batches/queries/use-batches-query';
import { useDebouncedValue } from '@/utils/use-debounced-value';
import type { FeeStatus, StudentFee } from '@/features/fees/api/fees';
import { CollectPaymentSheet } from '@/features/fees/components/collect-payment-sheet';
import { FeePaymentsHistoryDialog } from '@/features/fees/components/fee-payments-history-dialog';
import { ReceiptDialog } from '@/features/fees/components/receipt-dialog';
import { useStudentFeesQuery } from '@/features/fees/queries/use-fees';
import { cn } from '@/lib/utils';
import type { StudentDetailPageProps } from '@/types/students';
import {
  Archive,
  BookOpen,
  Calendar,
  ChevronLeft,
  CreditCard,
  History,
  Pencil,
  Phone,
  Plus,
  Receipt,
  Search,
  User,
  Users,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useArchiveStudentMutation } from '../mutations/use-archive-student-mutation';
import { useUpdateStudentMutation } from '../mutations/use-update-student-mutation';
import { useStudentEnrollments } from '../queries/use-student-enrollments';
import { useStudentQuery } from '../queries/use-students-query';
import { StudentProfileSection } from './student-profile-section';
import { StudentSheet } from './student-sheet';

const statusLabels: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
};

const statusVisuals: Record<string, 'success' | 'warning' | 'info'> = {
  active: 'success',
  inactive: 'warning',
  archived: 'info',
};

const feeStatusLabels: Record<FeeStatus, string> = {
  unpaid: 'Unpaid',
  partially_paid: 'Partially Paid',
  paid: 'Paid',
  overpaid: 'Overpaid',
  waived: 'Waived',
  overdue: 'Overdue',
};

const feeStatusVisuals: Record<FeeStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  paid: 'success',
  overpaid: 'success',
  partially_paid: 'warning',
  overdue: 'danger',
  unpaid: 'info',
  waived: 'info',
};

function formatDate(value?: string | null): string {
  if (!value) return 'Not recorded';
  try {
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatMonth(dateStr?: string | null): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function formatCurrency(amount?: string | number | null): string {
  if (amount === undefined || amount === null || amount === '') return '৳0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '৳0.00';
  return `৳${num.toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatTakaMinor(minor: string | null): string {
  if (minor === null || minor === undefined) return '—';
  const num = Number(minor);
  if (isNaN(num)) return '—';
  return `৳${(num / 100).toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function StudentDetailPage({ workspaceId, studentId }: StudentDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'fees' | 'enrollments' | 'profile'>('fees');
  const [editOpen, setEditOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);

  // Fee action sheets / modals
  const [selectedFeeForPayment, setSelectedFeeForPayment] = useState<StudentFee | null>(null);
  const [selectedFeeForHistory, setSelectedFeeForHistory] = useState<StudentFee | null>(null);
  const [activeReceiptNumber, setActiveReceiptNumber] = useState<string | null>(null);

  // Enrollment form state
  const [batchId, setBatchId] = useState('');
  const [batchSearch, setBatchSearch] = useState('');
  const debouncedBatchSearch = useDebouncedValue(batchSearch.trim());
  const [joinedAt, setJoinedAt] = useState(new Date().toISOString().slice(0, 10));
  const [feeOverrideTaka, setFeeOverrideTaka] = useState('');
  const [discountTaka, setDiscountTaka] = useState('');

  const studentQuery = useStudentQuery(workspaceId, studentId);
  const enrollmentsQuery = useStudentEnrollments(workspaceId, studentId);
  const feesQuery = useStudentFeesQuery(workspaceId, studentId);
  const batchesQuery = useBatchesQuery(workspaceId, {
    page: 1,
    limit: 20,
    search: debouncedBatchSearch || undefined,
    status: 'active',
  });

  const archiveMutation = useArchiveStudentMutation();
  const updateStudentMutation = useUpdateStudentMutation();
  const enrollMutation = useEnrollStudent();

  const student = studentQuery.data;
  const enrollments = useMemo(() => enrollmentsQuery.data ?? [], [enrollmentsQuery.data]);
  const fees = useMemo(() => feesQuery.data?.data ?? [], [feesQuery.data?.data]);

  // Map enrollment IDs to batch names for fast lookup
  const enrollmentBatchMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of enrollments) {
      map.set(e.id, e.batchName);
    }
    return map;
  }, [enrollments]);

  // Aggregate financial metrics across student fees
  const financialTotals = useMemo(() => {
    let billed = 0;
    let paid = 0;
    let due = 0;
    for (const f of fees) {
      const exp = parseFloat(f.expectedAmount || '0');
      const disc = parseFloat(f.discountAmount || '0');
      const p = parseFloat(f.paidAmount || '0');
      const d = parseFloat(f.dueAmount || '0');
      billed += Math.max(0, exp - disc);
      paid += p;
      due += d;
    }
    return {
      totalBilled: billed,
      totalPaid: paid,
      totalDue: due,
      activeBatches: enrollments.filter((e) => e.status === 'active').length,
    };
  }, [fees, enrollments]);

  const activeBatchesList = batchesQuery.data?.data ?? [];

  const closeEnrollment = () => {
    setEnrollOpen(false);
    setBatchId('');
    setBatchSearch('');
    setJoinedAt(new Date().toISOString().slice(0, 10));
    setFeeOverrideTaka('');
    setDiscountTaka('');
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId) {
      toast.error('Please select an active batch.');
      return;
    }

    const overrideMinor = feeOverrideTaka.trim()
      ? Math.round(parseFloat(feeOverrideTaka) * 100).toString()
      : null;
    const discountMinor = discountTaka.trim()
      ? Math.round(parseFloat(discountTaka) * 100).toString()
      : null;

    try {
      await enrollMutation.mutateAsync({
        workspaceId,
        batchId,
        input: {
          studentId,
          joinedAt: joinedAt || undefined,
          feeOverrideMinor: overrideMinor,
          discountMinor: discountMinor,
        },
      });
      toast.success('Student enrolled into batch successfully.');
      closeEnrollment();
      enrollmentsQuery.refetch();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      toast.error('Enrollment failed', {
        description: apiErr?.message || 'Student may already be enrolled in this batch.',
      });
    }
  };

  if (studentQuery.isPending) return <LoadingState rows={6} />;
  if (studentQuery.isError || !student) {
    return (
      <ErrorState
        message="Could not load this student profile. It may have been deleted or moved."
        onRetry={() => studentQuery.refetch()}
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
          render={<Link href="/workspace/students" />}
          className="rounded-full shadow-xs"
        >
          <ChevronLeft data-icon="inline-start" /> Back to Students
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
            variant={student.status === 'archived' ? 'outline' : 'destructive'}
            size="sm"
            onClick={() => setArchiveOpen(true)}
            className="rounded-full shadow-xs"
          >
            <Archive data-icon="inline-start" />
            {student.status === 'archived' ? 'Reactivate' : 'Archive'}
          </Button>
        </div>
      </div>

      {/* StyleOrbit Glass Hero Profile Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Identity & Main Info */}
          <div className="flex items-start gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-lime-500/30 bg-lime-500/10 font-heading text-xl font-bold text-lime-400 shadow-inner">
              {getInitials(student.fullName)}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {student.fullName}
                </h1>
                <StatusBadge status={statusVisuals[student.status]}>
                  {statusLabels[student.status] || student.status}
                </StatusBadge>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground">
                  {student.studentCode}
                </span>

                {student.phone && (
                  <span className="inline-flex items-center gap-1">
                    • <Phone className="size-3 text-muted-foreground" />
                    <a
                      href={`tel:${student.phone}`}
                      className="font-mono text-foreground hover:underline"
                    >
                      {student.phone}
                    </a>
                  </span>
                )}

                {student.guardianName && (
                  <span className="inline-flex items-center gap-1">
                    • <Users className="size-3 text-muted-foreground" />
                    <span>Guardian: {student.guardianName}</span>
                    {student.guardianPhone && (
                      <span className="font-mono text-muted-foreground">
                        ({student.guardianPhone})
                      </span>
                    )}
                  </span>
                )}

                <span className="inline-flex items-center gap-1">
                  • <Calendar className="size-3 text-muted-foreground" />
                  <span>Admitted {formatDate(student.admissionDate)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Hero Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => setEnrollOpen(true)}
              disabled={student.status !== 'active'}
              className="rounded-full shadow-sm"
            >
              <Plus data-icon="inline-start" /> Enroll in Batch
            </Button>
          </div>
        </div>
      </div>

      {/* Top 4 Financial & Enrollment Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Active Batches */}
        <div className="rounded-2xl border border-border bg-card p-4.5 ">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Active Batches</span>
            <BookOpen className="size-4 text-lime-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {financialTotals.activeBatches}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {enrollments.length} total batch enrollments
          </p>
        </div>

        {/* Total Billed */}
        <div className="rounded-2xl border border-border bg-card p-4.5 ">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Billed Fees</span>
            <Receipt className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(financialTotals.totalBilled)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Across {fees.length} fee snapshot cycles
          </p>
        </div>

        {/* Total Collected / Paid */}
        <div className="rounded-2xl border border-border bg-card p-4.5 ">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Paid to Date</span>
            <Wallet className="size-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold tracking-tight text-emerald-400">
            {formatCurrency(financialTotals.totalPaid)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {financialTotals.totalBilled > 0
              ? `${Math.round(
                  (financialTotals.totalPaid / financialTotals.totalBilled) * 100
                )}% of billed amount settled`
              : 'No billed dues recorded'}
          </p>
        </div>

        {/* Outstanding Dues */}
        <div className="rounded-2xl border border-border bg-card p-4.5 ">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Due Balance</span>
            <CreditCard
              className={`size-4 ${
                financialTotals.totalDue > 0 ? 'text-amber-400' : 'text-lime-400'
              }`}
            />
          </div>
          <div
            className={`mt-2 font-mono text-2xl font-bold tracking-tight ${
              financialTotals.totalDue > 0 ? 'text-amber-400' : 'text-foreground'
            }`}
          >
            {formatCurrency(financialTotals.totalDue)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {financialTotals.totalDue > 0
              ? 'Pending fee collection'
              : 'All monthly fees fully settled'}
          </p>
        </div>
      </div>

      {/* Tabs Header Navigation */}
      <nav
        className="w-full overflow-x-auto border-b border-border"
        aria-label="Student profile sections"
      >
        <div className="flex gap-2 min-w-max">
          <button
            type="button"
            onClick={() => setActiveTab('fees')}
            className={cn(
              'flex items-center gap-2 h-10 border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 -mb-[1px] cursor-pointer',
              activeTab === 'fees'
                ? 'border-primary text-foreground font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <CreditCard className="size-4" />
            Fee & Payment History
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-mono font-medium',
                activeTab === 'fees'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-muted text-muted-foreground border border-border/50'
              )}
            >
              {fees.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('enrollments')}
            className={cn(
              'flex items-center gap-2 h-10 border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 -mb-[1px] cursor-pointer',
              activeTab === 'enrollments'
                ? 'border-primary text-foreground font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <BookOpen className="size-4" />
            Batch Enrollments
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-mono font-medium',
                activeTab === 'enrollments'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-muted text-muted-foreground border border-border/50'
              )}
            >
              {enrollments.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={cn(
              'flex items-center gap-2 h-10 border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 -mb-[1px] cursor-pointer',
              activeTab === 'profile'
                ? 'border-primary text-foreground font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <User className="size-4" />
            Student & Guardian Profile
          </button>
        </div>
      </nav>

      {/* Tab 1: Fee & Payment History */}
      {activeTab === 'fees' && (
        <div className="space-y-4">
          <SectionCard
            title="Tuition Fee Ledger"
            description="Complete month-by-month record of tuition fees, discounts, payments, and receipt history."
          >
            {feesQuery.isPending ? (
              <LoadingState rows={4} />
            ) : feesQuery.isError ? (
              <ErrorState
                message="Could not load fee history for this student."
                onRetry={() => feesQuery.refetch()}
              />
            ) : fees.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/60 p-10 text-center text-muted-foreground">
                <Receipt className="mx-auto mb-3 size-10 text-muted-foreground opacity-40" />
                <p className="text-base font-semibold text-foreground">
                  No monthly fee records found
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Fees will appear here after monthly fee snapshots are generated for the
                  student&apos;s enrolled batches.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href="/workspace/fees" />}
                  className="mt-4 rounded-full"
                >
                  Go to Fee Management
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border/60">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/60 bg-muted/20 hover:bg-muted/20">
                      <TableHead className="w-[130px] font-medium text-foreground">
                        Fee Month
                      </TableHead>
                      <TableHead className="font-medium text-foreground">Batch</TableHead>
                      <TableHead className="text-right font-medium text-foreground">
                        Expected
                      </TableHead>
                      <TableHead className="text-right font-medium text-foreground">
                        Discount
                      </TableHead>
                      <TableHead className="text-right font-medium text-foreground">Paid</TableHead>
                      <TableHead className="text-right font-medium text-foreground">
                        Due Balance
                      </TableHead>
                      <TableHead className="text-center font-medium text-foreground">
                        Status
                      </TableHead>
                      <TableHead className="font-medium text-foreground">Due Date</TableHead>
                      <TableHead className="text-right font-medium text-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fees.map((fee: StudentFee) => {
                      const batchName =
                        fee.batch?.name || enrollmentBatchMap.get(fee.enrollmentId) || 'Batch Fee';
                      const dueNum = parseFloat(fee.dueAmount);
                      const statusKey = fee.status as FeeStatus;

                      return (
                        <TableRow
                          key={fee.id}
                          className="border-border/40 transition-colors hover:bg-muted/20"
                        >
                          {/* Fee Month */}
                          <TableCell className="font-medium text-foreground">
                            {formatMonth(fee.feeMonth)}
                          </TableCell>

                          {/* Batch Name */}
                          <TableCell className="text-xs text-muted-foreground">
                            {batchName}
                          </TableCell>

                          {/* Expected */}
                          <TableCell className="text-right font-mono text-xs text-foreground">
                            {formatCurrency(fee.expectedAmount)}
                          </TableCell>

                          {/* Discount */}
                          <TableCell className="text-right font-mono text-xs text-muted-foreground">
                            {parseFloat(fee.discountAmount) > 0 ? (
                              <span className="text-emerald-400">
                                -{formatCurrency(fee.discountAmount)}
                              </span>
                            ) : (
                              '—'
                            )}
                          </TableCell>

                          {/* Paid */}
                          <TableCell className="text-right font-mono text-xs font-semibold text-emerald-400">
                            {formatCurrency(fee.paidAmount)}
                          </TableCell>

                          {/* Due */}
                          <TableCell className="text-right font-mono text-xs font-bold">
                            <span
                              className={dueNum > 0 ? 'text-amber-400' : 'text-muted-foreground'}
                            >
                              {formatCurrency(fee.dueAmount)}
                            </span>
                          </TableCell>

                          {/* Status Badge */}
                          <TableCell className="text-center">
                            <StatusBadge status={feeStatusVisuals[statusKey] || 'info'}>
                              {feeStatusLabels[statusKey] || fee.status}
                            </StatusBadge>
                          </TableCell>

                          {/* Due Date */}
                          <TableCell className="text-xs text-muted-foreground">
                            {formatDate(fee.dueDate)}
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {dueNum > 0 && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() =>
                                    setSelectedFeeForPayment({
                                      ...fee,
                                      student: {
                                        id: student.id,
                                        fullName: student.fullName,
                                        studentCode: student.studentCode,
                                        phone: student.phone,
                                      },
                                      batch: {
                                        id: fee.enrollmentId,
                                        name: batchName,
                                      },
                                    })
                                  }
                                  className="h-7 rounded-full px-2.5 text-xs font-semibold shadow-xs"
                                >
                                  <CreditCard className="size-3" />
                                  Collect
                                </Button>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setSelectedFeeForHistory({
                                    ...fee,
                                    student: {
                                      id: student.id,
                                      fullName: student.fullName,
                                      studentCode: student.studentCode,
                                      phone: student.phone,
                                    },
                                    batch: {
                                      id: fee.enrollmentId,
                                      name: batchName,
                                    },
                                  })
                                }
                                className="h-7 rounded-full px-2 text-xs"
                              >
                                <History className="size-3" />
                                <span className="sr-only">History</span>
                              </Button>
                            </div>
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

      {/* Tab 2: Batch Enrollments */}
      {activeTab === 'enrollments' && (
        <div className="space-y-4">
          <SectionCard
            title="Active & Historical Enrollments"
            description="Coaching batches this student is enrolled into."
            action={
              <Button
                size="sm"
                onClick={() => setEnrollOpen(true)}
                disabled={student.status !== 'active'}
                className="rounded-full shadow-xs"
              >
                <Plus data-icon="inline-start" /> Enroll in Batch
              </Button>
            }
          >
            {enrollmentsQuery.isPending ? (
              <LoadingState rows={3} />
            ) : enrollmentsQuery.isError ? (
              <ErrorState
                message="Could not load batch enrollments."
                onRetry={() => enrollmentsQuery.refetch()}
              />
            ) : enrollments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-muted-foreground">
                <BookOpen className="mx-auto mb-2 size-8 opacity-40" />
                <p className="text-sm font-medium text-foreground">No batch enrollments yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Enroll this student into an active batch to schedule attendance and generate
                  monthly tuition fees.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {enrollments.map((e) => (
                  <div
                    key={e.id}
                    className="flex flex-col justify-between space-y-3 rounded-xl border border-border/70 bg-card/40 p-4 transition-colors hover:border-border"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{e.batchName}</h4>
                        <p className="text-xs text-muted-foreground">
                          Joined on {formatDate(e.joinedAt)}
                        </p>
                      </div>
                      <StatusBadge status={e.status === 'active' ? 'success' : 'info'}>
                        {e.status}
                      </StatusBadge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-border/40 pt-2.5 text-xs">
                      <div>
                        <span className="block text-[11px] text-muted-foreground">
                          Fee Override
                        </span>
                        <span className="font-mono font-medium text-foreground">
                          {formatTakaMinor(e.feeOverrideMinor)}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-muted-foreground">Discount</span>
                        <span className="font-mono font-medium text-emerald-400">
                          {formatTakaMinor(e.discountMinor)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* Tab 3: Student & Guardian Profile */}
      {activeTab === 'profile' && <StudentProfileSection student={student} />}

      {/* Edit Profile Sheet */}
      <StudentSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        workspaceId={workspaceId}
        student={student}
      />

      {/* Enroll in Batch Sheet */}
      <Sheet
        open={enrollOpen}
        onOpenChange={(open) => (open ? setEnrollOpen(true) : closeEnrollment())}
      >
        <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl data-[side=right]:w-full data-[side=right]:sm:max-w-2xl data-[side=right]:lg:max-w-3xl">
          <SheetHeader className="border-b border-border/40 pb-4 pr-12">
            <SheetTitle>Enroll in batch</SheetTitle>
            <SheetDescription>
              Assign {student.fullName} to an active coaching batch and set optional tuition fee
              overrides.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleEnrollSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <FieldGroup className="gap-5">
                {/* Batch Selector with Search */}
                <Field>
                  <FieldLabel htmlFor="enroll-batch-select">Select Active Batch *</FieldLabel>
                  <div className="relative mb-2">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={batchSearch}
                      onChange={(e) => setBatchSearch(e.target.value)}
                      placeholder="Search active batches by name…"
                      className="pl-9"
                    />
                  </div>
                  <Select
                    value={batchId}
                    onValueChange={(val) => setBatchId(val ?? '')}
                    disabled={batchesQuery.isPending || activeBatchesList.length === 0}
                  >
                    <SelectTrigger id="enroll-batch-select" className="w-full">
                      <SelectValue
                        placeholder={
                          batchesQuery.isPending
                            ? 'Loading active batches…'
                            : activeBatchesList.length
                              ? 'Choose an active batch'
                              : 'No active batches found'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {activeBatchesList.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                {/* Joined Date */}
                <Field>
                  <FieldLabel htmlFor="enroll-joined-date">Enrollment / Joined Date *</FieldLabel>
                  <Input
                    id="enroll-joined-date"
                    type="date"
                    value={joinedAt}
                    onChange={(e) => setJoinedAt(e.target.value)}
                    required
                  />
                  <FieldDescription>
                    Fee eligibility starts from this month onwards.
                  </FieldDescription>
                </Field>

                {/* Financial Overrides in Taka */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="enroll-fee-override">
                      Monthly Fee Override (BDT ৳)
                    </FieldLabel>
                    <Input
                      id="enroll-fee-override"
                      type="text"
                      inputMode="decimal"
                      placeholder="Leave blank for batch default"
                      value={feeOverrideTaka}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
                          setFeeOverrideTaka(val);
                        }
                      }}
                    />
                    <FieldDescription>
                      Optional custom tuition rate for this student.
                    </FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="enroll-discount">Monthly Discount (BDT ৳)</FieldLabel>
                    <Input
                      id="enroll-discount"
                      type="text"
                      inputMode="decimal"
                      placeholder="e.g. 500"
                      value={discountTaka}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
                          setDiscountTaka(val);
                        }
                      }}
                    />
                    <FieldDescription>
                      Recurring monthly waiver or scholarship discount.
                    </FieldDescription>
                  </Field>
                </div>
              </FieldGroup>
            </div>

            <SheetFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeEnrollment}
                disabled={enrollMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!batchId || enrollMutation.isPending}>
                {enrollMutation.isPending && <Spinner data-icon="inline-start" />}
                {enrollMutation.isPending ? 'Enrolling…' : 'Enroll student'}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Collect Payment Sheet */}
      <CollectPaymentSheet
        workspaceId={workspaceId}
        fee={selectedFeeForPayment}
        open={Boolean(selectedFeeForPayment)}
        onOpenChange={(open) => !open && setSelectedFeeForPayment(null)}
        onViewReceipt={(receiptNum) => {
          setActiveReceiptNumber(receiptNum);
        }}
      />

      {/* Fee Payment History Dialog */}
      <FeePaymentsHistoryDialog
        workspaceId={workspaceId}
        fee={selectedFeeForHistory}
        open={Boolean(selectedFeeForHistory)}
        onOpenChange={(open) => !open && setSelectedFeeForHistory(null)}
        onViewReceipt={(receiptNum) => {
          setActiveReceiptNumber(receiptNum);
        }}
      />

      {/* Official Receipt Dialog Modal */}
      <ReceiptDialog
        workspaceId={workspaceId}
        receiptNumber={activeReceiptNumber}
        open={Boolean(activeReceiptNumber)}
        onOpenChange={(open) => !open && setActiveReceiptNumber(null)}
      />

      {/* Archive / Reactivate Confirmation Dialog */}
      <AlertDialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {student.status === 'archived' ? 'Reactivate this student?' : 'Archive this student?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {student.status === 'archived'
                ? 'The student profile will become active again and can be enrolled into batches.'
                : 'The student will remain in the workspace record but will be marked as archived. Historical fee records and past attendance will remain preserved.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={archiveMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={student.status === 'archived' ? 'default' : 'destructive'}
              disabled={archiveMutation.isPending || updateStudentMutation.isPending}
              onClick={() => {
                if (student.status === 'archived') {
                  updateStudentMutation.mutate(
                    { workspaceId, studentId, input: { status: 'active' } },
                    {
                      onSuccess: () => {
                        toast.success('Student reactivated successfully.');
                        setArchiveOpen(false);
                      },
                    }
                  );
                } else {
                  archiveMutation.mutate(
                    { workspaceId, studentId },
                    {
                      onSuccess: () => {
                        toast.success('Student archived.');
                        setArchiveOpen(false);
                      },
                    }
                  );
                }
              }}
            >
              <Archive data-icon="inline-start" />
              {student.status === 'archived' ? 'Reactivate student' : 'Archive student'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
