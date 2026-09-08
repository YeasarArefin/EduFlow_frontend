"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  PAYMENT_METHODS,
  type PaymentMethod,
  type RecordPaymentResult,
  type StudentFee,
} from "../api/fees";
import { useRecordPaymentMutation } from "../hooks/use-fees";

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

function PaymentForm({
  workspaceId,
  fee,
  onClose,
  onViewReceipt,
}: {
  workspaceId: string;
  fee: StudentFee;
  onClose: () => void;
  onViewReceipt: (receiptNumber: string, resultData?: RecordPaymentResult) => void;
}) {
  const [amount, setAmount] = useState<string>(fee.dueAmount);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [receiptNumber, setReceiptNumber] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<RecordPaymentResult | null>(
    null,
  );

  const recordMutation = useRecordPaymentMutation(workspaceId);

  const dueNumber = parseFloat(fee.dueAmount);
  const enteredAmount = parseFloat(amount || "0");
  const isExcess = !isNaN(enteredAmount) && enteredAmount > dueNumber;
  const isZeroOrNegative = isNaN(enteredAmount) || enteredAmount <= 0;
  const newDueCalculated = Math.max(
    0,
    dueNumber - (isNaN(enteredAmount) ? 0 : enteredAmount),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isZeroOrNegative) {
      setErrorMsg("Please enter a valid payment amount greater than ৳0.");
      return;
    }

    if (isExcess) {
      setErrorMsg(
        `Payment amount cannot exceed the remaining due of ${formatCurrency(dueNumber)}.`,
      );
      return;
    }

    setErrorMsg(null);

    try {
      const result = await recordMutation.mutateAsync({
        feeId: fee.id,
        input: {
          amount: enteredAmount.toFixed(2),
          paymentMethod,
          paymentDate: paymentDate || undefined,
          receiptNumber: receiptNumber.trim() || undefined,
          note: note.trim() || undefined,
        },
      });

      setSuccessResult(result);
      toast.success("Payment recorded successfully", {
        description: `Receipt #${result.payment.receiptNumber} generated for ${formatCurrency(result.payment.amount)}`,
      });
    } catch (err: unknown) {
      const apiErr = err as { message?: string; code?: string };
      const message =
        apiErr?.message ||
        "Failed to record payment. Please check values and retry.";
      setErrorMsg(message);
      toast.error("Payment failed", { description: message });
    }
  };

  if (successResult) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="mx-auto max-w-md space-y-6 py-4 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-lime-500/30 bg-lime-500/10 text-lime-400">
              <CheckCircle2 className="size-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">
                Payment Recorded Successfully
              </h3>
              <p className="text-sm text-muted-foreground">
                Receipt{" "}
                <span className="font-mono font-semibold text-foreground">
                  #{successResult.payment.receiptNumber}
                </span>{" "}
                has been issued.
              </p>
            </div>

            <div className="space-y-3 rounded-xl border border-border/60 bg-card/40 p-4 text-left text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Student</span>
                <span className="font-semibold text-foreground">
                  {successResult.student.fullName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-mono text-base font-bold text-lime-400">
                  {formatCurrency(successResult.payment.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="text-xs font-medium uppercase tracking-wider text-foreground">
                  {successResult.payment.paymentMethod}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border/40 pt-2.5">
                <span className="text-muted-foreground">Remaining Due</span>
                <span
                  className={`font-mono font-semibold ${
                    Number(successResult.fee.dueAmount) > 0
                      ? "text-amber-400"
                      : "text-foreground"
                  }`}
                >
                  {formatCurrency(successResult.fee.dueAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            onClick={() => {
              onClose();
              onViewReceipt(successResult.payment.receiptNumber, successResult);
            }}
          >
            <Sparkles data-icon="inline-start" className="size-4" />
            View Printable Receipt
          </Button>
        </SheetFooter>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <FieldGroup className="gap-5">
          {/* Student & Fee Summary Bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl border border-border/50 bg-card/40 p-3.5 text-xs">
            <div>
              <span className="block text-[11px] text-muted-foreground">Student</span>
              <span className="block font-semibold text-foreground truncate">
                {fee.student?.fullName || "—"}
              </span>
              <span className="block font-mono text-[10px] text-muted-foreground">
                {fee.student?.studentCode || ""}
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-muted-foreground">Batch</span>
              <span className="block font-medium text-foreground truncate">
                {fee.batch?.name || "—"}
              </span>
              <span className="block text-[10px] text-muted-foreground">
                {formatMonth(fee.feeMonth)}
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-muted-foreground">Paid so far</span>
              <span className="block font-mono font-medium text-foreground">
                {formatCurrency(fee.paidAmount)}
              </span>
              <span className="block text-[10px] text-muted-foreground">
                of {formatCurrency(fee.expectedAmount)}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-medium text-lime-400">Due Balance</span>
              <span className="block font-mono font-bold text-lime-400 text-sm">
                {formatCurrency(fee.dueAmount)}
              </span>
            </div>
          </div>

          {/* Amount field */}
          <Field data-invalid={isExcess}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="payment-amount">
                Payment Amount (BDT ৳) *
              </FieldLabel>
              <button
                type="button"
                onClick={() => setAmount(fee.dueAmount)}
                className="cursor-pointer text-xs font-medium text-lime-400 hover:underline"
              >
                Pay Full ({formatCurrency(fee.dueAmount)})
              </button>
            </div>
            <Input
              id="payment-amount"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 2000"
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                  setAmount(val);
                }
              }}
              required
              aria-invalid={isExcess}
            />
            {isExcess ? (
              <FieldError
                errors={[
                  {
                    message: `Amount exceeds remaining due of ${formatCurrency(dueNumber)}.`,
                  },
                ]}
              />
            ) : (
              <FieldDescription>
                Remaining due after payment:{" "}
                <span className="font-mono font-semibold text-foreground">
                  {formatCurrency(newDueCalculated)}
                </span>
              </FieldDescription>
            )}
          </Field>

          {/* Payment Method and Date */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="payment-method">Payment Method *</FieldLabel>
              <Select
                value={paymentMethod}
                onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
              >
                <SelectTrigger id="payment-method" className="w-full">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem
                        key={method}
                        value={method}
                        className="font-medium uppercase"
                      >
                        {method}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="payment-date">Payment Date *</FieldLabel>
              <Input
                id="payment-date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
              />
            </Field>
          </div>

          {/* Custom Receipt Number (Optional) */}
          <Field>
            <FieldLabel htmlFor="receipt-number">
              Custom Receipt #{" "}
              <span className="font-normal text-muted-foreground">
                (Optional)
              </span>
            </FieldLabel>
            <Input
              id="receipt-number"
              placeholder="Leave empty to auto-generate (e.g. RCP-202609-0001)"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              className="font-mono"
            />
          </Field>

          {/* Note */}
          <Field>
            <FieldLabel htmlFor="payment-note">
              Note{" "}
              <span className="font-normal text-muted-foreground">
                (Optional)
              </span>
            </FieldLabel>
            <Textarea
              id="payment-note"
              placeholder="Remarks, guardian reference, or transaction details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </Field>

          {errorMsg && (
            <FieldError
              errors={[{ message: errorMsg }]}
            />
          )}
        </FieldGroup>
      </div>

      <SheetFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={recordMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            recordMutation.isPending ||
            isExcess ||
            isZeroOrNegative ||
            !amount.trim()
          }
        >
          {recordMutation.isPending && <Spinner data-icon="inline-start" />}
          {recordMutation.isPending
            ? "Recording payment…"
            : `Collect ${formatCurrency(enteredAmount || 0)}`}
        </Button>
      </SheetFooter>
    </form>
  );
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
              ? `Record fee payment for ${fee.student?.fullName ?? "student"} (${fee.feeMonth ? formatMonth(fee.feeMonth) : "selected month"}).`
              : "Record student tuition fee payment and issue a receipt."}
          </SheetDescription>
        </SheetHeader>

        {fee ? (
          <PaymentForm
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
