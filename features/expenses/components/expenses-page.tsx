'use client';
import { useMemo, useState } from 'react';
import { Plus, RotateCcw, Pencil, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DataTable,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Pagination,
  StatCard,
} from '@/components/dashboard/dashboard-primitives';
import type { Expense, ExpenseStatus, WorkspacePageProps } from '@/types/expenses';
import { formatFeeCurrency as formatCurrency } from '@/utils/fee-formatters';
import { useCreateExpenseCategory, useReverseExpense } from '../mutations/use-expense-mutations';
import { useExpenseCategories, useExpenses } from '../queries/use-expenses';
import { ExpenseSheet } from './expense-sheet';

const today = new Date().toISOString().slice(0, 10);
const firstOfMonth = `${today.slice(0, 8)}01`;
export function ExpensesPage({ workspaceId }: WorkspacePageProps) {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string>();
  const [status, setStatus] = useState<ExpenseStatus | undefined>();
  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [reversing, setReversing] = useState<Expense | null>(null);
  const [reason, setReason] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const params = useMemo(
    () => ({
      categoryId,
      status,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      page,
      limit: 20,
    }),
    [categoryId, status, startDate, endDate, page]
  );
  const categories = useExpenseCategories(workspaceId);
  const expenses = useExpenses(workspaceId, params);
  const reverse = useReverseExpense(workspaceId);
  const createCategory = useCreateExpenseCategory(workspaceId);
  function filter(update: () => void) {
    setPage(1);
    update();
  }
  async function addCategory() {
    if (!categoryName.trim()) return;
    await createCategory.mutateAsync({ name: categoryName.trim() });
    setCategoryName('');
  }
  async function confirmReverse() {
    if (!reversing || reason.trim().length < 3) return;
    await reverse.mutateAsync({ id: reversing.id, reason: reason.trim() });
    setReversing(null);
    setReason('');
  }
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Expenses"
        description="Record operating costs and preserve an auditable financial history."
        actions={
          <Button
            className="rounded-full"
            onClick={() => {
              setEditing(null);
              setSheetOpen(true);
            }}
          >
            <Plus data-icon="inline-start" />
            Add expense
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Recorded expenses"
          value={formatCurrency(expenses.data?.meta.activeTotal ?? '0')}
          detail="For the selected period"
          status="warning"
        />
        <StatCard
          label="Entries"
          value={expenses.data?.meta.total ?? 0}
          detail="Including reversals"
        />
        <StatCard
          label="Active categories"
          value={categories.data?.filter((item) => item.isActive).length ?? 0}
          detail="Available for new expenses"
        />
        <StatCard
          label="Period"
          value={startDate && endDate ? 'Selected' : 'All time'}
          detail="Based on expense dates"
        />
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-end">
        <div className="grid gap-1.5">
          <label className="text-sm font-medium">From</label>
          <Input
            type="date"
            value={startDate}
            onChange={(event) => filter(() => setStartDate(event.target.value))}
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium">To</label>
          <Input
            type="date"
            value={endDate}
            onChange={(event) => filter(() => setEndDate(event.target.value))}
          />
        </div>
        <Select
          value={categoryId ?? 'all'}
          onValueChange={(value) =>
            filter(() => setCategoryId(value === 'all' ? undefined : value))
          }
        >
          <SelectTrigger className="lg:w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.data?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status ?? 'all'}
          onValueChange={(value) =>
            filter(() => setStatus(value === 'all' ? undefined : (value as ExpenseStatus)))
          }
        >
          <SelectTrigger className="lg:w-40">
            <SelectValue placeholder="All records" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All records</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="reversed">Reversed</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex gap-2">
          <Input
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="New category"
            className="w-36"
          />
          <Button
            variant="outline"
            size="sm"
            disabled={createCategory.isPending}
            onClick={addCategory}
          >
            <Tags data-icon="inline-start" />
            Add
          </Button>
        </div>
      </div>
      {expenses.isPending ? (
        <LoadingState rows={6} />
      ) : expenses.isError ? (
        <ErrorState message="Could not load expenses." onRetry={() => expenses.refetch()} />
      ) : !expenses.data?.data.length ? (
        <EmptyState
          title="No expenses found"
          description="Add your first expense or adjust the selected date filters."
          action={
            <Button onClick={() => setSheetOpen(true)}>
              <Plus data-icon="inline-start" />
              Add expense
            </Button>
          }
        />
      ) : (
        <>
          <DataTable>
            <TableHeader>
              <TableRow>
                <TableHead>Expense</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.data.data.map((expense) => (
                <TableRow
                  key={expense.id}
                  className={expense.status === 'reversed' ? 'opacity-55' : ''}
                >
                  <TableCell>
                    <p className="font-medium">{expense.title}</p>
                    {expense.status === 'reversed' ? (
                      <p className="mt-0.5 text-xs text-destructive">
                        Reversed: {expense.reversalReason}
                      </p>
                    ) : expense.description ? (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {expense.description}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell>{expense.category.name}</TableCell>
                  <TableCell>
                    {new Date(`${expense.expenseDate}T00:00:00`).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="capitalize">
                    {expense.paymentMethod.replace('_', ' ')}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={expense.status === 'reversed'}
                        aria-label={`Edit ${expense.title}`}
                        onClick={() => {
                          setEditing(expense);
                          setSheetOpen(true);
                        }}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={expense.status === 'reversed'}
                        aria-label={`Reverse ${expense.title}`}
                        onClick={() => setReversing(expense)}
                      >
                        <RotateCcw />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
          <Pagination
            page={expenses.data.meta.page}
            pageCount={expenses.data.meta.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
      <ExpenseSheet
        workspaceId={workspaceId}
        categories={categories.data ?? []}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        expense={editing}
      />
      <AlertDialog open={Boolean(reversing)} onOpenChange={(open) => !open && setReversing(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reverse this expense?</AlertDialogTitle>
            <AlertDialogDescription>
              The record will stay in the audit trail but will no longer count toward expenditure.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Reason for reversal"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={reason.trim().length < 3 || reverse.isPending}
              onClick={confirmReverse}
            >
              {reverse.isPending ? 'Reversing…' : 'Reverse expense'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
