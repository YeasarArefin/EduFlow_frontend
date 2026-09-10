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
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { CalendarPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useGenerateSalaries } from '../queries/use-salaries';
import type { GenerateSalariesDialogProps } from '@/types/salaries';
import { formatSalaryMonth } from '@/utils/salary-formatters';

export function GenerateSalariesDialog({
  workspaceId,
  salaryMonth,
  open,
  onOpenChange,
}: GenerateSalariesDialogProps) {
  const generation = useGenerateSalaries(workspaceId);

  async function handleGenerate() {
    try {
      const result = await generation.mutateAsync(salaryMonth);
      toast.success('Salary ledgers generated', {
        description: `${result.created} created and ${result.existing} already existed for ${formatSalaryMonth(result.salaryMonth)}.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not generate salary ledgers.');
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Generate monthly salary ledgers?</AlertDialogTitle>
          <AlertDialogDescription>
            This creates one immutable salary snapshot for each active teacher. Existing ledgers for
            the month are kept unchanged.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Field>
          <FieldLabel htmlFor="salary-generation-month">Salary month</FieldLabel>
          <Input
            id="salary-generation-month"
            type="month"
            value={salaryMonth.slice(0, 7)}
            disabled
          />
          <FieldDescription>Selected month: {formatSalaryMonth(salaryMonth)}</FieldDescription>
        </Field>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={generation.isPending}>Cancel</AlertDialogCancel>
          <Button onClick={handleGenerate} disabled={generation.isPending}>
            {generation.isPending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <CalendarPlus data-icon="inline-start" />
            )}
            {generation.isPending ? 'Generating…' : 'Generate ledgers'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
