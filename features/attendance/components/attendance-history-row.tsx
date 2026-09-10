import { StatusBadge } from '@/components/status/status-badge';
import type { AttendanceHistoryRowProps } from '@/types/attendance';
import {
  formatAttendanceDate,
  getAttendanceStatusBadge,
  getAttendanceStatusLabel,
} from '@/utils/attendance-formatters';

export function AttendanceHistoryRow({ session, onOpen }: AttendanceHistoryRowProps) {
  const status = getAttendanceStatusBadge(session.status);
  const label = getAttendanceStatusLabel(session.status);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="grid w-full gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-accent-border hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"
    >
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{session.batch.name}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {formatAttendanceDate(session.sessionDate)} · {session.rosterCount} students
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{session.presentCount}</span> present ·{' '}
        <span className="font-medium text-foreground">{session.absentCount}</span> absent
      </p>
      <StatusBadge status={status}>{label}</StatusBadge>
    </button>
  );
}
