'use client';

import Link from 'next/link';
import { Archive, ChevronLeft, Pencil, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { ErrorState, LoadingState, PageHeader } from '@/components/dashboard/dashboard-primitives';
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
import type { TeacherDetailPageProps } from '@/types/teachers';
import {
  useArchiveTeacherMutation,
  useUpdateTeacherMutation,
} from '../mutations/use-teacher-mutations';
import { useTeacherQuery } from '../queries/use-teachers-query';
import { TeacherCompensationCard } from './teacher-compensation-card';
import { TeacherContactCard } from './teacher-contact-card';
import { TeacherNotesCard } from './teacher-notes-card';
import { TeacherOverviewCard } from './teacher-overview-card';
import { TeacherSheet } from './teacher-sheet';

export function TeacherDetailPage({ workspaceId, teacherId }: TeacherDetailPageProps) {
  const query = useTeacherQuery(workspaceId, teacherId);
  const archiveMutation = useArchiveTeacherMutation();
  const updateMutation = useUpdateTeacherMutation();
  const [edit, setEdit] = useState(false);
  const [confirm, setConfirm] = useState(false);

  if (query.isPending) return <LoadingState rows={5} />;
  if (query.isError || !query.data)
    return (
      <ErrorState message="Could not load this teacher record." onRetry={() => query.refetch()} />
    );

  const t = query.data;
  const isArchived = t.status === 'archived';

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Link
          href="/dashboard/teachers"
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" />
          <span>Teachers</span>
        </Link>
        <span>/</span>
        <span className="text-foreground">{t.name}</span>
      </div>

      <PageHeader
        title={t.name}
        description={`Teacher Code · ${t.teacherCode}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setEdit(true)}>
              <Pencil data-icon="inline-start" />
              <span>Edit profile</span>
            </Button>
            <Button
              variant={isArchived ? 'default' : 'destructive'}
              size="sm"
              onClick={() => setConfirm(true)}
            >
              {isArchived ? (
                <>
                  <RefreshCw data-icon="inline-start" />
                  <span>Reactivate</span>
                </>
              ) : (
                <>
                  <Archive data-icon="inline-start" />
                  <span>Archive</span>
                </>
              )}
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TeacherOverviewCard teacher={t} />
        <TeacherContactCard teacher={t} />
        <TeacherCompensationCard teacher={t} />

        {t.notes ? (
          <div className="md:col-span-2 lg:col-span-3">
            <TeacherNotesCard notes={t.notes} />
          </div>
        ) : null}
      </div>

      <TeacherSheet open={edit} onOpenChange={setEdit} workspaceId={workspaceId} teacher={t} />

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isArchived ? 'Reactivate teacher?' : 'Archive this teacher?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isArchived
                ? `This will restore ${t.name}'s profile to active status in this workspace.`
                : `This will mark ${t.name} as archived. Existing historical assignments and salary records will be preserved.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={isArchived ? 'default' : 'destructive'}
              onClick={() => {
                if (isArchived)
                  updateMutation.mutate(
                    { workspaceId, id: t.id, input: { status: 'active' } },
                    { onSuccess: () => setConfirm(false) }
                  );
                else
                  archiveMutation.mutate(
                    { workspaceId, id: t.id },
                    { onSuccess: () => setConfirm(false) }
                  );
              }}
            >
              {isArchived ? 'Reactivate' : 'Archive'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
