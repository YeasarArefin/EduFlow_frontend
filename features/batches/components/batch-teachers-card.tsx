'use client';

import { Crown, Search, Trash2, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ErrorState, LoadingState, SectionCard } from '@/components/dashboard/dashboard-primitives';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { useDebouncedValue } from '@/utils/use-debounced-value';
import { useTeachersQuery } from '@/features/teachers/queries/use-teachers-query';
import type { BatchTeacher, BatchTeachersCardProps } from '@/types/batches';
import {
  useAssignBatchTeacherMutation,
  useBatchTeachersQuery,
  useRemoveBatchTeacherMutation,
  useUpdateBatchTeacherMutation,
} from '../queries/use-batch-teachers';

export function BatchTeachersCard({ workspaceId, batchId }: BatchTeachersCardProps) {
  const assignments = useBatchTeachersQuery(workspaceId, batchId);
  const [teacherSearch, setTeacherSearch] = useState('');
  const debouncedTeacherSearch = useDebouncedValue(teacherSearch.trim());
  const teachers = useTeachersQuery(workspaceId, {
    page: 1,
    limit: 20,
    search: debouncedTeacherSearch || undefined,
    status: 'active',
  });
  const assign = useAssignBatchTeacherMutation();
  const update = useUpdateBatchTeacherMutation();
  const remove = useRemoveBatchTeacherMutation();

  const [teacherId, setTeacherId] = useState('');
  const [makePrimary, setMakePrimary] = useState(false);
  const [removing, setRemoving] = useState<BatchTeacher | null>(null);

  const options = useMemo(() => {
    const assignedIds = new Set(assignments.data?.map((teacher) => teacher.teacherId));
    return (teachers.data?.data ?? []).filter((teacher) => !assignedIds.has(teacher.id));
  }, [assignments.data, teachers.data?.data]);

  const pending = assign.isPending || update.isPending || remove.isPending;

  function runAssign() {
    if (!teacherId) return;
    const selectedTeacher = teachers.data?.data.find((t) => t.id === teacherId);
    assign.mutate(
      { workspaceId, batchId, teacherId, isPrimary: makePrimary },
      {
        onSuccess: () => {
          toast.success(`${selectedTeacher?.name ?? 'Teacher'} assigned to batch.`);
          setTeacherId('');
          setMakePrimary(false);
          setTeacherSearch('');
        },
        onError: (err: Error) => {
          toast.error(err.message || 'Could not assign teacher.');
        },
      }
    );
  }

  function runRemove() {
    if (!removing) return;
    remove.mutate(
      { workspaceId, batchId, teacherId: removing.teacherId },
      {
        onSuccess: () => {
          toast.success(`${removing.name} removed from this batch.`);
          setRemoving(null);
        },
        onError: (err: Error) => {
          toast.error(err.message || 'Could not remove teacher.');
        },
      }
    );
  }

  function togglePrimary(teacher: BatchTeacher) {
    update.mutate(
      {
        workspaceId,
        batchId,
        teacherId: teacher.teacherId,
        isPrimary: !teacher.isPrimary,
      },
      {
        onSuccess: () => {
          toast.success(
            `${teacher.name} is ${!teacher.isPrimary ? 'now primary instructor' : 'no longer primary'}.`
          );
        },
        onError: (err: Error) => {
          toast.error(err.message || 'Could not update primary status.');
        },
      }
    );
  }

  const assignedCount = assignments.data?.length ?? 0;

  return (
    <SectionCard
      title="Assigned Teachers"
      description="Instructors and educators assigned to this batch."
      action={
        assignedCount > 0 ? (
          <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground border border-border/60">
            {assignedCount} {assignedCount === 1 ? 'teacher' : 'teachers'}
          </span>
        ) : null
      }
    >
      <div className="space-y-4">
        {/* Quick Assign Faculty Box */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-3.5 space-y-3 backdrop-blur-xs">
          <p className="text-xs font-medium text-foreground">Assign instructor to batch</p>

          <div className="space-y-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={teacherSearch}
                onChange={(event) => setTeacherSearch(event.target.value)}
                placeholder="Search teacher name, code, or specialty"
                className="h-10 rounded-full bg-input/80 pl-9"
                disabled={pending}
              />
            </div>
            <Select
              value={teacherId}
              onValueChange={(value) => setTeacherId(value ?? '')}
              disabled={teachers.isPending || pending}
            >
              <SelectTrigger className="w-full h-10 rounded-full bg-input/80">
                <SelectValue
                  placeholder={
                    teachers.isPending
                      ? 'Loading instructors…'
                      : options.length
                        ? 'Choose teacher to assign'
                        : 'No available teachers'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.teacherCode})
                      {teacher.subjectSpecialty ? ` · ${teacher.subjectSpecialty}` : ''}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between gap-2 pt-1">
              <Button
                type="button"
                variant={makePrimary ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMakePrimary((current) => !current)}
                disabled={pending || !teacherId}
                className={cn(
                  'h-8 rounded-full text-xs transition-all',
                  makePrimary
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-muted-foreground'
                )}
              >
                <Crown className="size-3.5" data-icon="inline-start" />
                {makePrimary ? 'Primary Lead' : 'Make Lead'}
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={runAssign}
                disabled={!teacherId || pending}
                className="h-8 px-4 rounded-full font-semibold shadow-sm"
              >
                {assign.isPending ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <UserPlus data-icon="inline-start" />
                )}
                Assign
              </Button>
            </div>
          </div>

          {teachers.isSuccess && !teachers.data.data.length ? (
            <p className="text-xs text-muted-foreground">
              No active teachers are in your directory. Add teachers in the Teachers page first.
            </p>
          ) : null}
        </div>

        {assignments.isPending ? <LoadingState rows={2} /> : null}

        {assignments.isError ? (
          <ErrorState
            message="Could not load assigned teachers."
            onRetry={() => assignments.refetch()}
          />
        ) : null}

        {assignments.isSuccess && !assignments.data.length ? (
          <div className="rounded-2xl border border-dashed border-border/70 py-6 text-center text-sm text-muted-foreground">
            No instructors assigned to this batch yet.
          </div>
        ) : null}

        {/* Assigned Teachers List */}
        {assignments.data && assignments.data.length > 0 ? (
          <div className="space-y-2">
            {assignments.data.map((teacher) => (
              <div
                key={teacher.id}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/40 p-3 backdrop-blur-xs transition-all hover:border-border-strong hover:bg-card/70"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="font-semibold text-sm text-foreground">{teacher.name}</p>
                    {teacher.isPrimary ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/25">
                        <Crown className="size-3" /> Lead
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {teacher.teacherCode}
                    {teacher.phone ? ` · ${teacher.phone}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => togglePrimary(teacher)}
                    disabled={pending}
                    className="h-7 px-2.5 rounded-full text-[11px] font-medium text-muted-foreground hover:text-foreground"
                  >
                    {teacher.isPrimary ? 'Demote' : 'Make Lead'}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    aria-label={`Remove ${teacher.name}`}
                    title={`Remove ${teacher.name}`}
                    onClick={() => setRemoving(teacher)}
                    disabled={pending}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Remove Teacher Confirmation Dialog */}
      <AlertDialog open={Boolean(removing)} onOpenChange={(open) => !open && setRemoving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {removing?.name} from batch?</AlertDialogTitle>
            <AlertDialogDescription>
              {removing?.name} will no longer be assigned as an instructor for this batch.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending} className="rounded-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={remove.isPending}
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold shadow-sm"
              onClick={runRemove}
            >
              {remove.isPending && <Spinner data-icon="inline-start" />}
              Remove instructor
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SectionCard>
  );
}
