import { EmptyState, LoadingState } from '@/components/dashboard-primitives';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { Salary } from '../api/salaries';
import { useSalaryPayments } from '../hooks/use-salaries';
import { formatSalaryMoney } from './salary-formatters';

export function SalaryPaymentHistorySheet({
  salary,
  workspaceId,
  onClose,
}: {
  salary: Salary | null;
  workspaceId: string;
  onClose: () => void;
}) {
  const payments = useSalaryPayments(workspaceId, salary?.id ?? null);
  if (!salary) return null;
  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Payment history</SheetTitle>
          <SheetDescription>
            {salary.teacher?.name} · {salary.salaryMonth}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 p-6">
          {payments.isPending ? (
            <LoadingState />
          ) : payments.data?.length ? (
            payments.data.map((salaryPayment) => (
              <div className="rounded-xl border border-border p-3" key={salaryPayment.id}>
                <b>{formatSalaryMoney(salaryPayment.amount)}</b>
                <p className="text-sm">
                  {salaryPayment.paymentMethod} · {salaryPayment.paymentDate}
                </p>
                {salaryPayment.note && (
                  <p className="text-sm text-muted-foreground">{salaryPayment.note}</p>
                )}
              </div>
            ))
          ) : (
            <EmptyState title="No payments" description="No salary payments have been recorded." />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
