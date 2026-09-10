'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { ErrorState, LoadingState } from '@/components/dashboard/dashboard-primitives';
import type { BatchDetailPageProps } from '@/types/batches';
import { useBatchQuery } from '../queries/use-batches-query';
import { useBatchEnrollments } from '../queries/use-batch-enrollments';
import { useBatchTeachersQuery } from '../queries/use-batch-teachers';
import { BatchSheet } from './batch-sheet';
import { BatchProfileHero } from './batch-profile-hero';
import { BatchStudentsCard } from './batch-students-card';
import { BatchTeachersCard } from './batch-teachers-card';

export function BatchDetailPage({ workspaceId, id }: BatchDetailPageProps) {
  const query = useBatchQuery(workspaceId, id);
  const enrollmentsQuery = useBatchEnrollments(workspaceId, id);
  const teachersQuery = useBatchTeachersQuery(workspaceId, id);
  const [open, setOpen] = useState(false);

  if (query.isPending) return <LoadingState rows={5} />;
  if (query.isError)
    return (
      <ErrorState message="Could not load this batch profile." onRetry={() => query.refetch()} />
    );
  if (!query.data) return null;

  const batch = query.data;
  const activeStudentsCount = (enrollmentsQuery.data ?? []).filter(
    (e) => e.status === 'active'
  ).length;
  const teachersCount = (teachersQuery.data ?? []).length;

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Link
          href="/dashboard/batches"
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Batches</span>
        </Link>
        <span>/</span>
        <span className="text-foreground">{batch.name}</span>
      </div>

      <BatchProfileHero
        batch={batch}
        activeStudentsCount={activeStudentsCount}
        isStudentsLoading={enrollmentsQuery.isPending}
        teachersCount={teachersCount}
        isTeachersLoading={teachersQuery.isPending}
        onEdit={() => setOpen(true)}
      />

      {/* Roster & Faculty Management: Side-by-Side 2-Column Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 items-start">
        <BatchStudentsCard
          workspaceId={workspaceId}
          batchId={batch.id}
          defaultMonthlyFeeMinor={batch.monthlyFeeMinor}
          batchName={batch.name}
        />

        <BatchTeachersCard workspaceId={workspaceId} batchId={batch.id} />
      </div>

      <BatchSheet
        key={`${batch.id}-${open ? 'open' : 'closed'}`}
        open={open}
        onOpenChange={setOpen}
        workspaceId={workspaceId}
        batch={batch}
      />
    </div>
  );
}
