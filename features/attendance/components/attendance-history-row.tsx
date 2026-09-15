import { StatusBadge } from '@/components/status/status-badge';
import type { AttendanceHistoryRowProps } from '@/types/attendance';
import {
  formatAttendanceDate,
  getAttendancePercentage,
  getAttendanceStatusBadge,
  getAttendanceStatusLabel,
} from '@/utils/attendance-formatters';
import { Calendar, ChevronRight, Users } from 'lucide-react';

export function AttendanceHistoryRow({ session, onOpen }: AttendanceHistoryRowProps) {
  const status = getAttendanceStatusBadge(session.status);
  const label = getAttendanceStatusLabel(session.status);
  const percentage = getAttendancePercentage(session.presentCount, session.rosterCount);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group grid w-full gap-4 rounded-2xl border border-border/70 bg-card/60 p-4 text-left transition-all hover:border-primary/40 hover:bg-muted/30 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto_auto] sm:items-center"
    >
      {/* Batch & Date */}
      <div className="min-w-0 space-y-1">
        <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {session.batch.name}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-3 text-muted-foreground/70" />
            {formatAttendanceDate(session.sessionDate)}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Users className="size-3 text-muted-foreground/70" />
            {session.rosterCount} students
          </span>
        </div>
      </div>

      {/* Attendance Stats & Mini Progress Bar */}
      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Turnout:</span>
          <span className="font-semibold text-foreground">
            {percentage}%{' '}
            <span className="font-normal text-muted-foreground">
              ({session.presentCount}/{session.rosterCount})
            </span>
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between sm:justify-end gap-2">
        <StatusBadge status={status}>{label}</StatusBadge>
      </div>

      {/* Arrow Action */}
      <div className="hidden sm:flex size-8 shrink-0 items-center justify-center rounded-full border border-transparent group-hover:border-border/60 group-hover:bg-muted/40 transition-colors">
        <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
    </button>
  );
}

