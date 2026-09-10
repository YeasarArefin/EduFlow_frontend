'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import type { BatchEnrollStudentSheetProps } from '@/types/batches';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useEnrollStudent } from '../queries/use-batch-enrollments';

export function BatchEnrollStudentSheet({
  open,
  onOpenChange,
  workspaceId,
  batchId,
  batchName,
  defaultMonthlyFeeMinor,
  existingEnrollments,
  allStudents,
  isLoadingStudents,
}: BatchEnrollStudentSheetProps) {
  const enroll = useEnrollStudent();
  const [search, setSearch] = useState('');
  const [studentId, setStudentId] = useState('');
  const [joinedAt, setJoinedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [fee, setFee] = useState('');
  const [discount, setDiscount] = useState('');
  const students = useMemo(() => {
    const ids = new Set(
      existingEnrollments.filter((item) => item.status === 'active').map((item) => item.studentId)
    );
    const term = search.toLowerCase();
    return allStudents.filter(
      (student) =>
        !ids.has(student.id) &&
        student.status === 'active' &&
        `${student.fullName} ${student.studentCode} ${student.phone ?? ''}`
          .toLowerCase()
          .includes(term)
    );
  }, [allStudents, existingEnrollments, search]);
  const base = fee ? Number(fee) : Number(defaultMonthlyFeeMinor) / 100;
  const valid =
    Number.isFinite(base) &&
    base >= 0 &&
    (!discount || (Number.isFinite(Number(discount)) && Number(discount) >= 0));
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!studentId || !valid) return;
    enroll.mutate(
      {
        workspaceId,
        batchId,
        input: {
          studentId,
          joinedAt: joinedAt || undefined,
          feeOverrideMinor: fee ? Math.round(Number(fee) * 100).toString() : null,
          discountMinor: discount ? Math.round(Number(discount) * 100).toString() : null,
        },
      },
      {
        onSuccess: () => {
          toast.success(`Student enrolled in ${batchName} successfully.`);
          onOpenChange(false);
          setStudentId('');
          setFee('');
          setDiscount('');
          setSearch('');
        },
        onError: (error: Error) =>
          toast.error(error.message || 'Could not enroll student in this batch.'),
      }
    );
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl">
        <SheetHeader>
          <SheetTitle>Enroll Student in Batch</SheetTitle>
          <SheetDescription>
            Assign an active student to {batchName} and configure tuition fees.
          </SheetDescription>
        </SheetHeader>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit}>
          <div className="space-y-5 overflow-y-auto p-6">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, code, or phone"
            />
            <select
              className="w-full rounded-md border bg-background p-2"
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              disabled={isLoadingStudents || enroll.isPending}
            >
              <option value="">
                {isLoadingStudents ? 'Loading students…' : 'Choose an active student'}
              </option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.fullName} ({student.studentCode})
                </option>
              ))}
            </select>
            <Input
              type="date"
              value={joinedAt}
              onChange={(event) => setJoinedAt(event.target.value)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                inputMode="decimal"
                value={fee}
                onChange={(event) => setFee(event.target.value)}
                placeholder={`Custom fee (standard ৳${base})`}
              />
              <Input
                inputMode="decimal"
                value={discount}
                onChange={(event) => setDiscount(event.target.value)}
                placeholder="Monthly discount"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Effective monthly fee: ৳
              {Math.max(0, base - (Number(discount) || 0)).toLocaleString('en-BD', {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={enroll.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!studentId || !valid || enroll.isPending}>
              {enroll.isPending && <Spinner data-icon="inline-start" />}Enroll student
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
