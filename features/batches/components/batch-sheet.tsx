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
import { useAcademicReferences } from '@/features/settings/hooks/use-academic-references';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { Batch, BatchStatus } from '../api/batches';
import { useCreateBatchMutation, useUpdateBatchMutation } from '../hooks/use-batch-mutations';

type Values = {
  name: string;
  classLevelId: string;
  mediumId: string;
  academicGroupId: string;
  startDate: string;
  monthlyFee: string;
  status: Exclude<BatchStatus, 'archived'>;
};

function takaFromBatch(batch?: Batch): string {
  if (!batch) return '';
  if (batch.monthlyFee !== undefined && batch.monthlyFee !== null) {
    return batch.monthlyFee;
  }
  const minor = Number(batch.monthlyFeeMinor || 0);
  if (isNaN(minor) || minor === 0) return '0';
  return (minor / 100).toFixed(2).replace(/\.00$/, '');
}

function formatTakaPreview(taka: string): string {
  const clean = taka.trim();
  const num = Number(clean || 0);
  if (isNaN(num) || num < 0) return '৳ 0.00';
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

const initialValues = (batch?: Batch): Values => ({
  name: batch?.name ?? '',
  classLevelId: batch?.classLevelId ?? '',
  mediumId: batch?.mediumId ?? '',
  academicGroupId: batch?.academicGroupId ?? '',
  startDate: batch?.startDate ?? '',
  monthlyFee: takaFromBatch(batch),
  status: batch?.status === 'inactive' ? 'inactive' : 'active',
});

export function BatchSheet({
  open,
  onOpenChange,
  workspaceId,
  batch,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  batch?: Batch;
}) {
  const [values, setValues] = useState<Values>(() => initialValues(batch));
  const [submitted, setSubmitted] = useState(false);

  const classLevels = useAcademicReferences(workspaceId, 'class-levels');
  const mediums = useAcademicReferences(workspaceId, 'mediums');
  const groups = useAcademicReferences(workspaceId, 'academic-groups');

  const create = useCreateBatchMutation();
  const update = useUpdateBatchMutation();

  const isEditing = Boolean(batch);
  const pending = create.isPending || update.isPending;
  const loading = classLevels.isPending || mediums.isPending || groups.isPending;

  const active = (items: typeof classLevels.data) => (items ?? []).filter((item) => item.isActive);

  const isFeeValid =
    values.monthlyFee.trim() !== '' &&
    !isNaN(Number(values.monthlyFee)) &&
    Number(values.monthlyFee) >= 0;

  const isDirty = useMemo(() => {
    if (!batch) return true;
    const initial = initialValues(batch);
    return (
      values.name.trim() !== initial.name.trim() ||
      values.classLevelId !== initial.classLevelId ||
      values.mediumId !== initial.mediumId ||
      values.academicGroupId !== initial.academicGroupId ||
      values.startDate !== initial.startDate ||
      values.monthlyFee.trim() !== initial.monthlyFee.trim() ||
      values.status !== initial.status
    );
  }, [batch, values]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    if (!values.name.trim() || !values.classLevelId || !isFeeValid) return;

    const feeNum = Number(values.monthlyFee.trim() || 0);
    const feeMinor = Math.round(feeNum * 100).toString();

    const input = {
      name: values.name.trim(),
      classLevelId: values.classLevelId,
      mediumId: values.mediumId || null,
      academicGroupId: values.academicGroupId || null,
      startDate: values.startDate || null,
      monthlyFee: feeNum,
      monthlyFeeMinor: feeMinor,
      status: values.status,
    };

    const options = {
      onSuccess: () => {
        toast.success(isEditing ? 'Batch profile updated.' : 'Batch created successfully.');
        onOpenChange(false);
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Could not save batch. Please try again.');
      },
    };

    if (batch) {
      update.mutate({ workspaceId, id: batch.id, input }, options);
    } else {
      create.mutate({ workspaceId, input }, options);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl data-[side=right]:w-full data-[side=right]:sm:max-w-2xl data-[side=right]:lg:max-w-3xl">
        <SheetHeader className="border-b border-border/40 pb-4 pr-12">
          <SheetTitle>{isEditing ? 'Edit batch' : 'Create batch'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update academic parameters, schedule, and monthly fees for this batch.'
              : 'Set up the batch profile. Student and teacher assignments will be added later.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <FieldGroup className="gap-5">
              {/* Academic Profile */}
              <Field data-invalid={submitted && !values.name.trim()}>
                <FieldLabel htmlFor="batch-name">Batch Name *</FieldLabel>
                <Input
                  id="batch-name"
                  value={values.name}
                  onChange={(e) =>
                    setValues((current) => ({
                      ...current,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g. HSC 2026 Higher Math Batch A"
                  required
                  maxLength={120}
                  aria-invalid={submitted && !values.name.trim()}
                />
                {submitted && !values.name.trim() && (
                  <FieldError errors={[{ message: 'Batch name is required.' }]} />
                )}
              </Field>

              <Field data-invalid={submitted && !values.classLevelId}>
                <FieldLabel htmlFor="batch-class-level">Class Level *</FieldLabel>
                <Select
                  value={values.classLevelId}
                  onValueChange={(classLevelId) =>
                    setValues((current) => ({
                      ...current,
                      classLevelId: classLevelId ?? '',
                    }))
                  }
                  disabled={loading}
                >
                  <SelectTrigger id="batch-class-level" className="w-full">
                    <SelectValue
                      placeholder={loading ? 'Loading class levels…' : 'Select class level'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {active(classLevels.data).map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {!loading && !active(classLevels.data).length ? (
                  <FieldDescription>
                    Add active class levels in Settings → Academic Setup.
                  </FieldDescription>
                ) : null}
                {submitted && !values.classLevelId && (
                  <FieldError errors={[{ message: 'Please select a class level.' }]} />
                )}
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="batch-medium">Medium</FieldLabel>
                  <Select
                    value={values.mediumId || 'none'}
                    onValueChange={(mediumId) =>
                      setValues((current) => ({
                        ...current,
                        mediumId: mediumId === 'none' ? '' : (mediumId ?? ''),
                      }))
                    }
                    disabled={loading}
                  >
                    <SelectTrigger id="batch-medium" className="w-full">
                      <SelectValue placeholder={loading ? 'Loading…' : 'Not set'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="none">Not set</SelectItem>
                        {active(mediums.data).map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="batch-academic-group">Academic Group</FieldLabel>
                  <Select
                    value={values.academicGroupId || 'none'}
                    onValueChange={(academicGroupId) =>
                      setValues((current) => ({
                        ...current,
                        academicGroupId: academicGroupId === 'none' ? '' : (academicGroupId ?? ''),
                      }))
                    }
                    disabled={loading}
                  >
                    <SelectTrigger id="batch-academic-group" className="w-full">
                      <SelectValue placeholder={loading ? 'Loading…' : 'Not set'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="none">Not set</SelectItem>
                        {active(groups.data).map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="batch-start-date">Batch Start Date</FieldLabel>
                  <Input
                    id="batch-start-date"
                    type="date"
                    value={values.startDate}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        startDate: event.target.value,
                      }))
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="batch-status">Status</FieldLabel>
                  <Select
                    value={values.status}
                    onValueChange={(status) =>
                      setValues((current) => ({
                        ...current,
                        status: status as Values['status'],
                      }))
                    }
                  >
                    <SelectTrigger id="batch-status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field data-invalid={submitted && !isFeeValid}>
                <FieldLabel htmlFor="batch-monthly-fee">Monthly Fee (BDT ৳) *</FieldLabel>
                <Input
                  id="batch-monthly-fee"
                  type="text"
                  inputMode="decimal"
                  value={values.monthlyFee}
                  onChange={(event) => {
                    const val = event.target.value;
                    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
                      setValues((current) => ({
                        ...current,
                        monthlyFee: val,
                      }));
                    }
                  }}
                  placeholder="e.g. 2000"
                  required
                  aria-invalid={submitted && !isFeeValid}
                />
                <FieldDescription>
                  {values.monthlyFee.trim() && !isNaN(Number(values.monthlyFee))
                    ? `Per student fee: ${formatTakaPreview(values.monthlyFee)} / month`
                    : 'Enter the monthly tuition fee in Taka (e.g. 2000).'}
                </FieldDescription>
                {submitted && !isFeeValid && (
                  <FieldError errors={[{ message: 'Enter a valid monthly fee amount in Taka.' }]} />
                )}
              </Field>
            </FieldGroup>
          </div>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                pending ||
                loading ||
                !values.name.trim() ||
                !values.classLevelId ||
                !isFeeValid ||
                (isEditing && !isDirty)
              }
            >
              {pending && <Spinner data-icon="inline-start" />}
              {isEditing ? 'Save changes' : 'Create batch'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
