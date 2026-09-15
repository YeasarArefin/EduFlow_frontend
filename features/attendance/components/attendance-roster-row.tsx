import type { AttendanceRosterProps } from '@/types/attendance';
import { getStudentInitials } from '@/utils/attendance-formatters';
import { Phone } from 'lucide-react';
import { AttendanceControl } from './attendance-control';

export function AttendanceRosterRow({ record, value, disabled, onChange }: AttendanceRosterProps) {
  const initials = getStudentInitials(record.student.fullName);

  return (
    <div className="grid grid-cols-[110px_minmax(0,1fr)_220px] items-center gap-4 border-b border-border/50 px-4 py-3 transition-colors hover:bg-muted/20 last:border-b-0">
      {/* Student Code */}
      <span className="font-mono text-xs font-medium text-muted-foreground">
        {record.student.studentCode}
      </span>

      {/* Student Identity + Phone */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/60 text-xs font-semibold text-foreground border border-border/60">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{record.student.fullName}</p>
          {record.student.phone ? (
            <a
              href={`tel:${record.student.phone}`}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="size-3" />
              <span>{record.student.phone}</span>
            </a>
          ) : (
            <span className="text-[11px] text-muted-foreground/60">No phone</span>
          )}
        </div>
      </div>

      {/* Control */}
      <AttendanceControl value={value} disabled={disabled} onChange={onChange} />
    </div>
  );
}

