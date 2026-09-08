"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2, CreditCard, Printer, User, Wallet } from "lucide-react";
import type { ReceiptDetail } from "../api/fees";
import { useReceiptQuery } from "../hooks/use-fees";

function formatCurrency(amount?: string | number | null): string {
  if (amount === undefined || amount === null || amount === "") return "৳0.00";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "৳0.00";
  return `৳${num.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatMonth(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function ReceiptDialog({
  workspaceId,
  receiptNumber,
  open,
  onOpenChange,
  initialData,
}: {
  workspaceId: string;
  receiptNumber: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ReceiptDetail | null;
}) {
  const query = useReceiptQuery(workspaceId, open ? receiptNumber : null);
  const data = initialData || query.data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-border/40 p-6 pb-4 pr-12 text-left">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-lime-400">
            <CheckCircle2 className="size-4 text-lime-400" />
            <span>Money Receipt</span>
          </div>
          <DialogTitle className="text-xl font-bold font-sans">
            Receipt #{receiptNumber || data?.receiptNumber || "—"}
          </DialogTitle>
          <DialogDescription>
            Official coaching tuition payment record.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          {query.isLoading && !data ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <Spinner className="size-6 text-lime-400" />
              <p className="text-sm">Loading receipt details...</p>
            </div>
          ) : !data ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Receipt details could not be found.
            </div>
          ) : (
            <div className="space-y-4 print:m-0 print:p-0">
              {/* Receipt Visual Card */}
              <div className="space-y-4 rounded-xl border border-border/60 bg-card/40 p-4">
                {/* Header summary badge */}
                <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3">
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">
                      Amount Paid
                    </span>
                    <span className="font-mono text-2xl font-bold text-lime-400">
                      {formatCurrency(data.amount)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">
                      Payment Date
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {formatDate(data.paymentDate)}
                    </span>
                  </div>
                </div>

                {/* Student & Payment Method info */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="mb-1 flex items-center gap-1 text-muted-foreground">
                      <User className="size-3.5" /> Student
                    </span>
                    <p className="text-sm font-semibold text-foreground">
                      {data.student?.fullName || "—"}
                    </p>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {data.student?.studentCode || "—"}
                    </span>
                  </div>

                  <div>
                    <span className="mb-1 flex items-center gap-1 text-muted-foreground">
                      <Wallet className="size-3.5" /> Method
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-500/20 bg-lime-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-lime-400">
                      <CreditCard className="size-3" />
                      {data.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Fee context & financial breakdown */}
                {data.fee && (
                  <div className="space-y-2 rounded-lg border border-border/40 bg-background/50 p-3 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Fee Month</span>
                      <span className="font-medium text-foreground">
                        {formatMonth(data.fee.feeMonth)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Expected Monthly Fee</span>
                      <span className="font-mono text-foreground">
                        {formatCurrency(data.fee.expectedAmount)}
                      </span>
                    </div>
                    {Number(data.fee.discountAmount) > 0 && (
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>Discount Applied</span>
                        <span className="font-mono">
                          -{formatCurrency(data.fee.discountAmount)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-border/30 pt-1.5 text-muted-foreground">
                      <span>Total Paid to Date</span>
                      <span className="font-mono text-foreground">
                        {formatCurrency(data.fee.paidAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-border/40 pt-2 text-sm font-semibold">
                      <span className="text-foreground">Remaining Due Balance</span>
                      <span
                        className={`font-mono ${
                          Number(data.fee.dueAmount) > 0
                            ? "text-amber-400 font-bold"
                            : "text-lime-400 font-bold"
                        }`}
                      >
                        {formatCurrency(data.fee.dueAmount)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Transaction note if present */}
                {data.note && (
                  <div className="border-t border-border/30 pt-2.5 text-xs text-muted-foreground">
                    <span className="mb-0.5 block font-medium text-foreground">
                      Note:
                    </span>
                    {data.note}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border/40 bg-muted/30 p-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={handlePrint}
            disabled={!data}
          >
            <Printer data-icon="inline-start" className="size-4" />
            Print Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const ReceiptSheet = ReceiptDialog;
export const ReceiptModal = ReceiptDialog;
