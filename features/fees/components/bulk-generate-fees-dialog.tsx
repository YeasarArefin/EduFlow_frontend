'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Calendar, CheckCircle2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { BulkGenerateResult } from '../api/fees';
import { useBulkGenerateFeesMutation } from '../queries/use-fees';

function formatMonth(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function BulkGenerateFeesDialog({
  workspaceId,
  selectedMonth,
  open,
  onOpenChange,
}: {
  workspaceId: string;
  selectedMonth: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [feeMonth, setFeeMonth] = useState(selectedMonth);
  const [result, setResult] = useState<BulkGenerateResult | null>(null);

  const generateMutation = useBulkGenerateFeesMutation(workspaceId);

  const handleGenerate = async () => {
    try {
      const res = await generateMutation.mutateAsync(feeMonth);
      setResult(res);
      toast.success('Fee snapshot generation completed', {
        description: `Created ${res.created} new monthly fees for ${formatMonth(res.feeMonth)}.`,
      });
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      toast.error('Generation failed', {
        description: apiErr?.message || 'Failed to generate monthly fees.',
      });
    }
  };

  const handleClose = () => {
    setResult(null);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2">
            <Calendar className="size-5" />
          </div>
          <AlertDialogTitle>Generate Monthly Fees</AlertDialogTitle>
          <AlertDialogDescription>
            Generate fee snapshots for all active enrolled students for the selected month. Existing
            fees will not be duplicated.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {result ? (
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center space-y-1">
              <CheckCircle2 className="size-6 text-primary mx-auto mb-1" />
              <p className="font-semibold text-foreground text-sm">
                Generated for {formatMonth(result.feeMonth)}
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2 text-xs font-mono">
                <div>
                  <span className="text-muted-foreground block">Eligible</span>
                  <span className="font-bold text-foreground">{result.eligible}</span>
                </div>
                <div>
                  <span className="text-primary block">Created</span>
                  <span className="font-bold text-primary">{result.created}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Existing</span>
                  <span className="font-bold text-foreground">{result.existing}</span>
                </div>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full rounded-full">
              Done
            </Button>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="fee-month-input" className="text-xs font-semibold text-foreground">
                Fee Month
              </label>
              <Input
                id="fee-month-input"
                type="date"
                value={feeMonth}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    // Ensure it snaps to first day of month (YYYY-MM-01)
                    const [y, m] = val.split('-');
                    setFeeMonth(`${y}-${m}-01`);
                  }
                }}
              />
            </div>

            <AlertDialogFooter className="pt-2">
              <AlertDialogCancel
                onClick={handleClose}
                disabled={generateMutation.isPending}
                className="rounded-full"
              >
                Cancel
              </AlertDialogCancel>
              <Button
                onClick={handleGenerate}
                disabled={generateMutation.isPending || !feeMonth}
                className="rounded-full gap-2 shadow-sm font-semibold"
              >
                {generateMutation.isPending ? (
                  <>
                    <Spinner data-icon="inline-start" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" /> Generate Now
                  </>
                )}
              </Button>
            </AlertDialogFooter>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
