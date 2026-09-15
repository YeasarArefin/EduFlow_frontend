'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
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
import { useAcademicReferences } from '@/features/settings/queries/use-academic-references';
import { cn } from '@/lib/utils';
import type { Batch, BatchSheetProps, BatchSheetValues } from '@/types/batches';
import { formatBatchTakaPreview, getBatchMonthlyFeeInTaka } from '@/utils/batch-formatters';
import { useMemo, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CalendarDays, Check, RotateCcw, Sparkles } from 'lucide-react';
import { useCreateBatchMutation, useUpdateBatchMutation } from '../mutations/use-batch-mutations';

const initialValues = (batch?: Batch): BatchSheetValues => ({
  name: batch?.name ?? '',
  classLevelId: batch?.classLevelId ?? '',
  mediumId: batch?.mediumId ?? '',
  academicGroupId: batch?.academicGroupId ?? '',
  startDate: batch?.startDate ?? '',
  classDays: batch?.classDays ?? [],
  monthlyFee: getBatchMonthlyFeeInTaka(batch),
  status: batch?.status === 'inactive' ? 'inactive' : 'active',
});

const weekdays = [
  { label: 'Sun', full: 'Sunday', day: 0 },
  { label: 'Mon', full: 'Monday', day: 1 },
  { label: 'Tue', full: 'Tuesday', day: 2 },
  { label: 'Wed', full: 'Wednesday', day: 3 },
  { label: 'Thu', full: 'Thursday', day: 4 },
  { label: 'Fri', full: 'Friday', day: 5 },
  { label: 'Sat', full: 'Saturday', day: 6 },
] as const;

const ALL_DAYS = weekdays.map((w) => w.day);

const PRESETS = [
  { id: 'stt', label: 'Sun, Tue, Thu', shortLabel: 'STT (Sun-Tue-Thu)', days: [0, 2, 4] },
  { id: 'smw', label: 'Sat, Mon, Wed', shortLabel: 'SMW (Sat-Mon-Wed)', days: [6, 1, 3] },
  { id: 'mwf', label: 'Mon, Wed, Fri', shortLabel: 'MWF (Mon-Wed-Fri)', days: [1, 3, 5] },
  { id: 'weekend', label: 'Fri, Sat', shortLabel: 'Weekend (Fri-Sat)', days: [5, 6] },
  { id: 'weekdays', label: 'Sun - Thu', shortLabel: 'Weekdays (Sun-Thu)', days: [0, 1, 2, 3, 4] },
  { id: 'daily', label: 'Everyday', shortLabel: 'Daily (7 days)', days: [0, 1, 2, 3, 4, 5, 6] },
] as const;

export function BatchSheet({ open, onOpenChange, workspaceId, batch }: BatchSheetProps) {
  const [values, setValues] = useState<BatchSheetValues>(() => initialValues(batch));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(initialValues(batch));
      setSubmitted(false);
    }
  }, [batch, open]);

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
    const sortedCurrent = [...values.classDays].sort((a, b) => a - b).join(',');
    const sortedInitial = [...initial.classDays].sort((a, b) => a - b).join(',');
    return (
      values.name.trim() !== initial.name.trim() ||
      values.classLevelId !== initial.classLevelId ||
      values.mediumId !== initial.mediumId ||
      values.academicGroupId !== initial.academicGroupId ||
      values.startDate !== initial.startDate ||
      sortedCurrent !== sortedInitial ||
      values.monthlyFee.trim() !== initial.monthlyFee.trim() ||
      values.status !== initial.status
    );
  }, [batch, values]);

  const selectedDaysSorted = useMemo(() => {
    return weekdays.filter((w) => values.classDays.includes(w.day));
  }, [values.classDays]);

  const selectedDaysLabel = useMemo(() => {
    if (!selectedDaysSorted.length) return '';
    return selectedDaysSorted.map((w) => w.label).join(', ');
  }, [selectedDaysSorted]);

  const activePresetId = useMemo(() => {
    const currentKey = [...values.classDays].sort((a, b) => a - b).join(',');
    const match = PRESETS.find(
      (p) => [...p.days].sort((a, b) => a - b).join(',') === currentKey
    );
    return match?.id ?? null;
  }, [values.classDays]);

  function toggleDay(day: number) {
    setValues((current) => ({
      ...current,
      classDays: current.classDays.includes(day)
        ? current.classDays.filter((item) => item !== day)
        : [...current.classDays, day].sort((a, b) => a - b),
    }));
  }

  function applyPreset(days: readonly number[]) {
    setValues((current) => ({
      ...current,
      classDays: [...days].sort((a, b) => a - b),
    }));
  }

  function clearAllDays() {
    setValues((current) => ({
      ...current,
      classDays: [],
    }));
  }

  function selectAllDays() {
    setValues((current) => ({
      ...current,
      classDays: [...ALL_DAYS],
    }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    if (!values.name.trim() || !values.classLevelId || !values.classDays.length || !isFeeValid)
      return;

    const feeNum = Number(values.monthlyFee.trim() || 0);
    const feeMinor = Math.round(feeNum * 100).toString();

    const input = {
      name: values.name.trim(),
      classLevelId: values.classLevelId,
      mediumId: values.mediumId || null,
      academicGroupId: values.academicGroupId || null,
      startDate: values.startDate || null,
      classDays: [...values.classDays].sort((a, b) => a - b),
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
      <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl">
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

              <FieldSet data-invalid={submitted && !values.classDays.length}>
                <div className="flex items-center justify-between gap-2">
                  <FieldLegend variant="label">Class Days *</FieldLegend>
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={selectAllDays}
                      className="h-6 rounded-full px-2 text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      <Check className="size-3 mr-1" />
                      Select all
                    </Button>
                    {values.classDays.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={clearAllDays}
                        className="h-6 rounded-full px-2 text-[11px] text-muted-foreground hover:text-destructive"
                      >
                        <RotateCcw className="size-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                </div>

                <FieldDescription>
                  Select the recurring days this batch holds classes.
                </FieldDescription>

                {/* Day Selection Pills */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2" data-slot="checkbox-group">
                  {weekdays.map(({ label, full, day }) => {
                    const checked = values.classDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        role="checkbox"
                        aria-checked={checked}
                        aria-label={`${full} (${label})`}
                        onClick={() => toggleDay(day)}
                        className={cn(
                          'flex flex-col items-center justify-center rounded-xl py-2 px-1 text-center transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
                          checked
                            ? 'bg-primary text-primary-foreground font-semibold shadow-xs shadow-primary/20 scale-[1.02]'
                            : 'bg-card/70 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/70'
                        )}
                      >
                        <span className="text-xs font-semibold tracking-tight">{label}</span>
                        <span
                          className={cn(
                            'mt-0.5 text-[9px] uppercase tracking-wider',
                            checked ? 'text-primary-foreground/80' : 'text-muted-foreground/60'
                          )}
                        >
                          {day === 5 || day === 6 ? 'Wknd' : 'Wkdy'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Live Selection Summary */}
                {values.classDays.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-xs">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <CalendarDays className="size-3.5 text-primary" />
                      {selectedDaysSorted.length} {selectedDaysSorted.length === 1 ? 'day' : 'days'} / week:
                    </span>
                    <span className="text-muted-foreground">{selectedDaysLabel}</span>
                  </div>
                )}

                {/* Quick Presets */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                    <Sparkles className="size-3 text-primary" />
                    <span>Quick Routine Presets:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESETS.map((preset) => {
                      const isActive = activePresetId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => applyPreset(preset.days)}
                          className={cn(
                            'rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors border',
                            isActive
                              ? 'border-primary/40 bg-primary/15 text-primary shadow-xs'
                              : 'border-border/60 bg-card/40 text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground'
                          )}
                        >
                          {preset.shortLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {submitted && !values.classDays.length ? (
                  <FieldError errors={[{ message: 'Select at least one class day.' }]} />
                ) : null}
              </FieldSet>

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
                        status: status as BatchSheetValues['status'],
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
                    ? `Per student fee: ${formatBatchTakaPreview(values.monthlyFee)} / month`
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
                !values.classDays.length ||
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
