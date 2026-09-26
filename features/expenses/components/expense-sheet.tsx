'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
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
import { Textarea } from '@/components/ui/textarea';
import { EXPENSE_PAYMENT_METHODS, type ExpenseSheetProps } from '@/types/expenses';
import { useCreateExpense, useUpdateExpense } from '../mutations/use-expense-mutations';

const label = (method: string) =>
  method.replace('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
export function ExpenseSheet({
  workspaceId,
  categories,
  open,
  onOpenChange,
  expense,
}: ExpenseSheetProps) {
  const create = useCreateExpense(workspaceId);
  const update = useUpdateExpense(workspaceId);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof EXPENSE_PAYMENT_METHODS)[number]>('cash');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    setTitle(expense?.title ?? '');
    setAmount(expense?.amount ?? '');
    setCategoryId(expense?.categoryId ?? categories.find((item) => item.isActive)?.id ?? '');
    setExpenseDate(expense?.expenseDate ?? new Date().toISOString().slice(0, 10));
    setPaymentMethod(expense?.paymentMethod ?? 'cash');
    setDescription(expense?.description ?? '');
    setError('');
  }, [categories, expense, open]);
  const saving = create.isPending || update.isPending;
  async function submit() {
    if (!title.trim() || !amount || !categoryId || !expenseDate) {
      setError('Title, amount, category, and date are required.');
      return;
    }
    try {
      const input = {
        title: title.trim(),
        amount,
        categoryId,
        expenseDate,
        paymentMethod,
        description: description.trim() || undefined,
      };
      if (expense) await update.mutateAsync({ id: expense.id, input });
      else await create.mutateAsync(input);
      onOpenChange(false);
    } catch {
      setError('Could not save the expense. Please try again.');
    }
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{expense ? 'Edit expense' : 'Add expense'}</SheetTitle>
          <SheetDescription>
            Record a real coaching cost in BDT. Reversed entries remain in the ledger for financial
            history.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 overflow-y-auto px-5 pb-5">
          <div className="grid gap-2">
            <Label htmlFor="expense-title">Title</Label>
            <Input
              id="expense-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. September electricity bill"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="expense-amount">Amount (৳)</Label>
              <Input
                id="expense-amount"
                inputMode="decimal"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expense-date">Expense date</Label>
              <Input
                id="expense-date"
                type="date"
                value={expenseDate}
                onChange={(event) => setExpenseDate(event.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((category) => category.isActive || category.id === expense?.categoryId)
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Payment method</Label>
            <Select
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as (typeof EXPENSE_PAYMENT_METHODS)[number])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {label(method)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expense-description">
              Description <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="expense-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add an internal note or reference."
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={saving} onClick={submit}>
            {saving ? 'Saving…' : expense ? 'Save changes' : 'Add expense'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
