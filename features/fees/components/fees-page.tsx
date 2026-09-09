'use client';

import {
  DataTable,
  EmptyState,
  ErrorState,
  FilterToolbar,
  LoadingState,
  PageHeader,
  Pagination,
  StatCard,
} from '@/components/dashboard-primitives';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  History,
  Receipt,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { FEE_STATUSES, type FeeStatus, type StudentFee } from '../api/fees';
import { useFeesQuery } from '../hooks/use-fees';
import { BulkGenerateFeesDialog } from './bulk-generate-fees-dialog';
import { CollectPaymentSheet } from './collect-payment-sheet';
import { FeePaymentsHistoryDialog } from './fee-payments-history-dialog';
import { ReceiptDialog } from './receipt-dialog';

const pageSize = 20;

const statusLabels: Record<FeeStatus, string> = {
  unpaid: 'Unpaid',
  partially_paid: 'Partially Paid',
  paid: 'Paid',
  overpaid: 'Overpaid',
  waived: 'Waived',
  overdue: 'Overdue',
};

const statusVisual: Record<FeeStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  paid: 'success',
  overpaid: 'success',
  partially_paid: 'warning',
  overdue: 'danger',
  unpaid: 'info',
  waived: 'info',
};

function formatCurrency(amount?: string | number | null): string {
  if (amount === undefined || amount === null || amount === '') return '৳0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '৳0.00';
  return `৳${num.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatMonth(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getDefaultMonth(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
}

function shiftMonth(monthStr: string, delta: number): string {
  try {
    const [y, m] = monthStr.split('-').map(Number);
    const date = new Date(y, m - 1 + delta, 1);
    const newY = date.getFullYear();
    const newM = String(date.getMonth() + 1).padStart(2, '0');
    return `${newY}-${newM}-01`;
  } catch {
    return monthStr;
  }
}

export function FeesPage({ workspaceId }: { workspaceId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active sheets / modals state
  const [selectedFeeForPayment, setSelectedFeeForPayment] = useState<StudentFee | null>(null);
  const [selectedFeeForHistory, setSelectedFeeForHistory] = useState<StudentFee | null>(null);
  const [activeReceiptNumber, setActiveReceiptNumber] = useState<string | null>(null);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);

  // URL State
  const activeMonth = searchParams.get('feeMonth') || getDefaultMonth();
  const activeStatus = searchParams.get('status') as FeeStatus | undefined;
  const activeSearch = searchParams.get('search') || undefined;
  const activePage = Number(searchParams.get('page')) || 1;

  const params = useMemo(
    () => ({
      feeMonth: activeMonth,
      status: activeStatus && FEE_STATUSES.includes(activeStatus) ? activeStatus : undefined,
      search: activeSearch,
      page: activePage,
      limit: pageSize,
    }),
    [activeMonth, activeStatus, activeSearch, activePage]
  );

  const query = useFeesQuery(workspaceId, params);
  const fees = query.data?.data ?? [];
  const meta = query.data?.meta;
  const summary = meta?.summary;

  function updateUrl(updates: Record<string, string | undefined>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) =>
      value ? next.set(key, value) : next.delete(key)
    );
    router.replace(next.size ? `${pathname}?${next}` : pathname);
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Page Header */}
      <PageHeader
        title="Fee Collection"
        description="Track monthly dues, record partial or full payments, and view receipts."
        actions={
          <Button
            onClick={() => setGenerateDialogOpen(true)}
            variant="outline"
            className="rounded-full shadow-xs gap-2"
          >
            <Sparkles className="size-4 text-primary" /> Generate Monthly Fees
          </Button>
        }
      />

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label={`Expected (${formatMonth(activeMonth)})`}
          value={formatCurrency(summary?.totalExpected)}
          detail="Total billed charges"
        />
        <StatCard
          label="Total Collected"
          value={formatCurrency(summary?.totalCollected)}
          detail="Collected payments to date"
          status="success"
        />
        <StatCard
          label="Outstanding Dues"
          value={formatCurrency(summary?.totalOutstanding)}
          detail="Remaining unpaid balance"
          status="warning"
        />
        <StatCard
          label="Overdue Balance"
          value={formatCurrency(summary?.totalOverdue)}
          detail="Past grace period"
          status="danger"
        />
      </div>

      {/* Filter & Search Toolbar */}
      <FilterToolbar
        placeholder="Search by student name or code..."
        onSearch={(term) => updateUrl({ search: term || undefined, page: undefined })}
        searchValue={activeSearch}
      >
        {/* Month Navigator Controls */}
        <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-input px-1.5 py-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              updateUrl({
                feeMonth: shiftMonth(activeMonth, -1),
                page: undefined,
              })
            }
            className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
            title="Previous Month"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <span className="px-2 text-xs font-semibold text-foreground font-mono flex items-center gap-1.5">
            <Calendar className="size-3.5 text-primary" />
            {formatMonth(activeMonth)}
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              updateUrl({
                feeMonth: shiftMonth(activeMonth, 1),
                page: undefined,
              })
            }
            className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
            title="Next Month"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* Status Filter */}
        <Select
          value={activeStatus ?? 'all'}
          onValueChange={(val) =>
            updateUrl({
              status: val === 'all' ? undefined : val,
              page: undefined,
            })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All statuses</SelectItem>
              {FEE_STATUSES.map((st) => (
                <SelectItem key={st} value={st}>
                  {statusLabels[st]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FilterToolbar>

      {/* Main Content Area */}
      {query.isLoading ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState
          message="Failed to load student fee records. Please retry."
          onRetry={() => query.refetch()}
        />
      ) : fees.length === 0 ? (
        <EmptyState
          title="No fee records found"
          description={
            activeSearch || activeStatus
              ? 'No fee records match the selected filters.'
              : `No student fee snapshots generated for ${formatMonth(activeMonth)} yet.`
          }
          action={
            !activeSearch && !activeStatus ? (
              <Button
                onClick={() => setGenerateDialogOpen(true)}
                className="rounded-full shadow-sm gap-2"
              >
                <Sparkles className="size-4" /> Generate Fees for {formatMonth(activeMonth)}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <DataTable>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[240px]">Student</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead className="text-right">Expected</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Due Balance</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((fee) => {
                  const dueVal = parseFloat(fee.dueAmount);
                  const isPayable = dueVal > 0 && fee.status !== 'waived';

                  return (
                    <TableRow key={fee.id} className="group">
                      {/* Student Column */}
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-mono text-xs font-bold shrink-0">
                            {fee.student?.fullName?.slice(0, 1) || 'S'}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/dashboard/students/${fee.studentId}`}
                              className="font-semibold text-foreground hover:text-primary transition-colors truncate block text-sm"
                            >
                              {fee.student?.fullName || 'Student'}
                            </Link>
                            <span className="text-xs text-muted-foreground font-mono">
                              {fee.student?.studentCode || '—'}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Batch Column */}
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-background border border-border text-foreground">
                          {fee.batch?.name || 'Batch'}
                        </span>
                      </TableCell>

                      {/* Expected */}
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(fee.expectedAmount)}
                      </TableCell>

                      {/* Discount */}
                      <TableCell className="text-right font-mono text-sm text-emerald-500">
                        {Number(fee.discountAmount) > 0
                          ? `-${formatCurrency(fee.discountAmount)}`
                          : '—'}
                      </TableCell>

                      {/* Paid */}
                      <TableCell className="text-right font-mono text-sm text-foreground">
                        {formatCurrency(fee.paidAmount)}
                      </TableCell>

                      {/* Due Balance */}
                      <TableCell className="text-right font-mono text-sm font-bold">
                        <span className={dueVal > 0 ? 'text-amber-500 font-bold' : 'text-primary'}>
                          {formatCurrency(fee.dueAmount)}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        <StatusBadge status={statusVisual[fee.status]}>
                          {statusLabels[fee.status]}
                        </StatusBadge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPayable ? (
                            <Button
                              size="sm"
                              onClick={() => setSelectedFeeForPayment(fee)}
                              className="rounded-full h-8 text-xs font-semibold gap-1.5 px-3 shadow-xs"
                            >
                              <CreditCard className="size-3.5" /> Collect
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedFeeForHistory(fee)}
                              className="rounded-full h-8 text-xs gap-1.5 px-3"
                            >
                              <Receipt className="size-3.5" /> Receipts
                            </Button>
                          )}

                          {Number(fee.paidAmount) > 0 && isPayable && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedFeeForHistory(fee)}
                              className="rounded-full h-8 text-xs text-muted-foreground hover:text-foreground px-2"
                              title="View Payment History"
                            >
                              <History className="size-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </DataTable>
          </div>

          {/* Mobile Stacked Cards View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {fees.map((fee) => {
              const dueVal = parseFloat(fee.dueAmount);
              const isPayable = dueVal > 0 && fee.status !== 'waived';

              return (
                <div
                  key={fee.id}
                  className="rounded-2xl border border-border/80 bg-card/60 p-4 space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/students/${fee.studentId}`}
                        className="font-semibold text-foreground text-base hover:text-primary transition-colors block truncate"
                      >
                        {fee.student?.fullName || 'Student'}
                      </Link>
                      <p className="text-xs text-muted-foreground font-mono">
                        {fee.student?.studentCode} • {fee.batch?.name}
                      </p>
                    </div>
                    <StatusBadge status={statusVisual[fee.status]}>
                      {statusLabels[fee.status]}
                    </StatusBadge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-background/50 rounded-xl border border-border/30">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Expected</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatCurrency(fee.expectedAmount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Paid</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatCurrency(fee.paidAmount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Due Balance</span>
                      <span
                        className={`font-mono font-bold ${
                          dueVal > 0 ? 'text-amber-500' : 'text-primary'
                        }`}
                      >
                        {formatCurrency(fee.dueAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    {Number(fee.paidAmount) > 0 ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedFeeForHistory(fee)}
                        className="rounded-full text-xs gap-1.5 h-8 px-3"
                      >
                        <History className="size-3.5" /> Payments
                      </Button>
                    ) : (
                      <div />
                    )}

                    {isPayable && (
                      <Button
                        size="sm"
                        onClick={() => setSelectedFeeForPayment(fee)}
                        className="rounded-full text-xs font-semibold gap-1.5 h-8 px-4 ml-auto shadow-xs"
                      >
                        <CreditCard className="size-3.5" /> Collect Payment
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <Pagination
              page={meta.page}
              pageCount={meta.totalPages}
              onPageChange={(p) => updateUrl({ page: String(p) })}
            />
          )}
        </div>
      )}

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

      {/* Bulk Generate Fees Dialog */}
      <BulkGenerateFeesDialog
        workspaceId={workspaceId}
        selectedMonth={activeMonth}
        open={generateDialogOpen}
        onOpenChange={setGenerateDialogOpen}
      />
    </div>
  );
}
