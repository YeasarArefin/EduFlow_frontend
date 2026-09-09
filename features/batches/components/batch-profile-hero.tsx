import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import type { Batch } from '@/features/batches/api/batches';
import { Calendar, DollarSign, GraduationCap, Pencil, Users } from 'lucide-react';
import { BatchProfileMetadataItem } from './batch-profile-metadata-item';

function formatMoney(value: string) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 2,
  }).format(Number(value) / 100);
}

function formatDate(value: string | null) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en-BD', { dateStyle: 'medium' }).format(
    new Date(`${value}T00:00:00`)
  );
}

function statusVisual(status: Batch['status']) {
  return status === 'active' ? 'success' : status === 'inactive' ? 'warning' : 'info';
}

export function BatchProfileHero({
  batch,
  activeStudentsCount,
  isStudentsLoading,
  teachersCount,
  isTeachersLoading,
  onEdit,
}: {
  batch: Batch;
  activeStudentsCount: number;
  isStudentsLoading: boolean;
  teachersCount: number;
  isTeachersLoading: boolean;
  onEdit: () => void;
}) {
  const academicSummary = [batch.classLevel?.name, batch.medium?.name, batch.academicGroup?.name]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="rounded-3xl border border-border/80 bg-card/40 p-6 backdrop-blur-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {batch.name}
            </h1>
            <StatusBadge status={statusVisual(batch.status)}>{batch.status}</StatusBadge>
          </div>
          <p className="text-sm text-muted-foreground">
            {academicSummary || 'General Academic Batch'}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          disabled={batch.status === 'archived'}
          className="shrink-0 self-start rounded-full shadow-xs sm:self-center"
        >
          <Pencil data-icon="inline-start" /> Edit batch
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/40 pt-5 sm:grid-cols-4">
        <BatchProfileMetadataItem
          label="Monthly Tuition"
          icon={<DollarSign className="size-5" />}
          value={
            <>
              {formatMoney(batch.monthlyFeeMinor)}{' '}
              <span className="text-xs font-normal text-muted-foreground">/ mo</span>
            </>
          }
        />
        <BatchProfileMetadataItem
          label="Start Date"
          icon={<Calendar className="size-5" />}
          value={formatDate(batch.startDate)}
        />
        <BatchProfileMetadataItem
          label="Enrolled Students"
          icon={<Users className="size-5" />}
          value={
            <>
              {isStudentsLoading ? '…' : activeStudentsCount}{' '}
              <span className="text-xs font-normal text-muted-foreground">
                {activeStudentsCount === 1 ? 'student' : 'students'}
              </span>
            </>
          }
        />
        <BatchProfileMetadataItem
          label="Assigned Faculty"
          icon={<GraduationCap className="size-5" />}
          value={
            <>
              {isTeachersLoading ? '…' : teachersCount}{' '}
              <span className="text-xs font-normal text-muted-foreground">
                {teachersCount === 1 ? 'teacher' : 'teachers'}
              </span>
            </>
          }
        />
      </div>
    </div>
  );
}
