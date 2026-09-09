'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { RecordPaymentResult, StudentFee } from '../api/fees';
import { FeePaymentForm } from './fee-payment-form';

function formatMonth(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function CollectPaymentSheet({
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
  onViewReceipt: (receiptNumber: string, resultData?: RecordPaymentResult) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl data-[side=right]:w-full data-[side=right]:sm:max-w-2xl data-[side=right]:lg:max-w-3xl">
        <SheetHeader className="border-b border-border/40 pb-4 pr-12">
          <SheetTitle>Collect payment</SheetTitle>
          <SheetDescription>
            {fee
              ? `Record fee payment for ${fee.student?.fullName ?? 'student'} (${fee.feeMonth ? formatMonth(fee.feeMonth) : 'selected month'}).`
              : 'Record student tuition fee payment and issue a receipt.'}
          </SheetDescription>
        </SheetHeader>
        {fee ? (
          <FeePaymentForm
            key={fee.id}
            workspaceId={workspaceId}
            fee={fee}
            onClose={() => onOpenChange(false)}
            onViewReceipt={onViewReceipt}
          />
        ) : (
          <div className="flex-1 py-12 text-center text-sm text-muted-foreground">
            No fee record selected.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
