import { StatusBadge } from '@/components/status-badge';
import type { AttendanceSessionSummary } from '../api/attendance';

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

export function AttendanceHistoryRow({
  session,
  onOpen,
}: {
  session: AttendanceSessionSummary;
  onOpen: () => void;
}) {
  const status = session.status === 'finalized' ? 'success' : 'warning';
  const label = session.status === 'finalized' ? 'Finalized' : 'Draft';
  return (
    <button
      type="button"
      onClick={onOpen}
      className="grid w-full gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-accent-border hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"
    >
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{session.batch.name}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {formatDate(session.sessionDate)} · {session.rosterCount} students
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
