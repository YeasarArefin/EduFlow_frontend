import { Button } from '@/components/ui/button';
import type { StudentPayment } from '../api/fees';
import { CreditCard, Eye } from 'lucide-react';

function formatCurrency(amount: string) {
  return `৳${Number(amount).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function FeePaymentHistoryItem({
  payment,
  onViewReceipt,
}: {
  payment: StudentPayment;
  onViewReceipt: (receiptNumber: string) => void;
}) {
  return (
    <div className="space-y-2.5 rounded-xl border border-border/60 bg-card/40 p-4 transition-colors hover:border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-lime-400">
            #{payment.receiptNumber}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-lime-500/20 bg-lime-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-lime-400">
            <CreditCard className="size-2.5" />
            {payment.paymentMethod}
          </span>
        </div>
        <span className="font-mono text-base font-bold text-foreground">
          {formatCurrency(payment.amount)}
        </span>
      </div>
      <div className="flex items-center justify-between border-t border-border/30 pt-2 text-xs text-muted-foreground">
        <span>Paid on {formatDate(payment.paymentDate)}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onViewReceipt(payment.receiptNumber)}
          className="h-7 gap-1 px-2 text-xs text-lime-400 hover:bg-lime-500/10 hover:text-lime-300"
        >
          <Eye className="size-3" /> View Receipt
        </Button>
      </div>
      {payment.note && (
        <p className="rounded-lg border border-border/30 bg-background/50 p-2 text-xs text-muted-foreground">
          {payment.note}
        </p>
      )}
    </div>
  );
}
