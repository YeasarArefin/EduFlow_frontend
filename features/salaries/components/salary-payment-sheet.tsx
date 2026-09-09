'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
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
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import type { Salary } from '../api/salaries';
import { useRecordSalaryPayment } from '../hooks/use-salaries';
import { formatSalaryMoney } from './salary-formatters';

const paymentMethods = ['cash', 'bkash', 'nagad', 'rocket', 'other'] as const;
const paymentSchema = z.object({
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount with up to two decimal places.')
    .refine(
      (value) => Number(value) > 0 && Number.isFinite(Number(value)),
      'Amount must be greater than zero.'
    ),
  paymentMethod: z.enum(paymentMethods),
  paymentDate: z.iso.date(),
  note: z.string().trim().max(500, 'Note must be 500 characters or fewer.'),
});

export function SalaryPaymentSheet({
  salary,
  workspaceId,
  onClose,
}: {
  salary: Salary | null;
  workspaceId: string;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<(typeof paymentMethods)[number]>('cash');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [error, setError] = useState<string>();
  const payment = useRecordSalaryPayment(workspaceId);
  if (!salary) return null;
  const selectedSalary = salary;
  const isExcess = Number(amount) > Number(selectedSalary.dueAmount);
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = paymentSchema.safeParse({ amount, paymentMethod, paymentDate, note });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Check the payment details and try again.');
      return;
    }
    if (Number(parsed.data.amount) > Number(selectedSalary.dueAmount)) {
      setError(
        `Payment cannot exceed the remaining salary balance of ${formatSalaryMoney(selectedSalary.dueAmount)}.`
      );
      return;
    }
    setError(undefined);
    try {
      await payment.mutateAsync({
        id: selectedSalary.id,
        ...parsed.data,
        note: parsed.data.note || undefined,
      });
      toast.success('Salary payment recorded.');
      onClose();
    } catch (paymentError) {
      setError(
        paymentError instanceof Error
          ? paymentError.message
          : 'Could not record the salary payment.'
      );
    }
  }
  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Pay salary</SheetTitle>
          <SheetDescription>
            {salary.teacher?.name} · due {formatSalaryMoney(salary.dueAmount)}
          </SheetDescription>
        </SheetHeader>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
            <div className="rounded-xl border border-border bg-card p-3 text-sm">
              Expected {formatSalaryMoney(salary.expectedSalary)} · Adjustment{' '}
              {formatSalaryMoney(salary.adjustmentAmount)} · Already paid{' '}
              {formatSalaryMoney(salary.paidAmount)}
            </div>
            <FieldGroup>
              <Field data-invalid={Boolean(error) || isExcess}>
                <FieldLabel htmlFor="salary-payment-amount">Payment amount</FieldLabel>
                <Input
                  id="salary-payment-amount"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  aria-invalid={Boolean(error) || isExcess}
                  placeholder="0.00"
                />
                <FieldDescription>
                  Maximum available payout: {formatSalaryMoney(salary.dueAmount)}
                </FieldDescription>
                {(error || isExcess) && (
                  <FieldError>
                    {error ?? `Payment cannot exceed ${formatSalaryMoney(salary.dueAmount)}.`}
                  </FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="salary-payment-method">Payment method</FieldLabel>
                <Select
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as typeof paymentMethod)}
                >
                  <SelectTrigger id="salary-payment-method" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="salary-payment-date">Payment date</FieldLabel>
                <Input
                  id="salary-payment-date"
                  type="date"
                  value={paymentDate}
                  onChange={(event) => setPaymentDate(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="salary-payment-note">
                  Note <span className="font-normal text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Textarea
                  id="salary-payment-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  maxLength={500}
                />
              </Field>
            </FieldGroup>
          </div>
          <SheetFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={payment.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={!amount || isExcess || payment.isPending}>
              {payment.isPending && <Spinner data-icon="inline-start" />}
              {payment.isPending ? 'Recording…' : 'Record payment'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
