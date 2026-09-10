import { StatusBadge } from '@/components/status/status-badge';
import { Button } from '@/components/ui/button';
import type { BatchProfileHeroProps } from '@/types/batches';
import { Calendar, CalendarDays, DollarSign, GraduationCap, Pencil, Users } from 'lucide-react';
import { BatchProfileMetadataItem } from './batch-profile-metadata-item';
import { formatBatchDate, formatBatchMoney, getBatchStatusVisual } from '@/utils/batch-formatters';

export function BatchProfileHero({
  batch,
  activeStudentsCount,
  isStudentsLoading,
  teachersCount,
  isTeachersLoading,
  onEdit,
}: BatchProfileHeroProps) {
  const academicSummary = [batch.classLevel?.name, batch.medium?.name, batch.academicGroup?.name]
    .filter(Boolean)
    .join(' · ');
  const classDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    .filter((_, day) => batch.classDays.includes(day))
    .join(', ');

  return (
    <div className="rounded-3xl border border-border/80 bg-card/40 p-6 backdrop-blur-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {batch.name}
            </h1>
            <StatusBadge status={getBatchStatusVisual(batch.status)}>{batch.status}</StatusBadge>
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

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/40 pt-5 sm:grid-cols-5">
        <BatchProfileMetadataItem
          label="Monthly Tuition"
          icon={<DollarSign className="size-5" />}
          value={
            <>
              {formatBatchMoney(batch.monthlyFeeMinor)}{' '}
              <span className="text-xs font-normal text-muted-foreground">/ mo</span>
            </>
          }
        />
        <BatchProfileMetadataItem
          label="Class Days"
          icon={<CalendarDays className="size-5" />}
          value={classDays || 'Not set'}
        />
        <BatchProfileMetadataItem
          label="Start Date"
          icon={<Calendar className="size-5" />}
          value={formatBatchDate(batch.startDate)}
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
