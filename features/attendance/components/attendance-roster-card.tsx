import type { AttendanceRosterProps } from '@/types/attendance';
import { AttendanceControl } from './attendance-control';

export function AttendanceRosterCard({ record, value, disabled, onChange }: AttendanceRosterProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{record.student.fullName}</p>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            {record.student.studentCode}
          </p>
        </div>
      </div>
      <AttendanceControl value={value} disabled={disabled} onChange={onChange} />
    </div>
  );
}
