'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { History, Receipt } from 'lucide-react';
import type { StudentFee } from '../api/fees';
import { useFeePaymentsQuery } from '../queries/use-fees';
import { FeePaymentHistoryItem } from './fee-payment-history-item';

function formatMonth(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function FeePaymentsHistoryDialog({
  workspaceId,
  fee,
  open,
  onOpenChange,
  onViewReceipt,
}: {
  workspaceId: string;
  fee: StudentFee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewReceipt: (receiptNumber: string) => void;
}) {
  const query = useFeePaymentsQuery(workspaceId, open && fee ? fee.id : null);
  const payments = query.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-border/40 p-6 pb-4 pr-12 text-left">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-lime-400">
            <History className="size-4 text-lime-400" />
            <span>Payment History</span>
          </div>
          <DialogTitle className="text-xl font-bold font-sans">
            Payments for {fee?.student?.fullName || 'Student Fee'}
          </DialogTitle>
          <DialogDescription>
            All recorded payment receipts for {fee ? formatMonth(fee.feeMonth) : 'this fee'}.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          {query.isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
              <Spinner className="size-6 text-lime-400" />
              <p className="text-sm">Loading payment history...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-muted-foreground">
              <Receipt className="mx-auto mb-2 size-8 opacity-40 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">No payments recorded yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                When a payment is collected against this fee, its receipt will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <FeePaymentHistoryItem
                  key={payment.id}
                  payment={payment}
                  onViewReceipt={(receiptNumber) => {
                    onOpenChange(false);
                    onViewReceipt(receiptNumber);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border/40 bg-muted/30 p-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const FeePaymentsHistorySheet = FeePaymentsHistoryDialog;
