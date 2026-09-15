import type { AttendanceRosterProps } from '@/types/attendance';
import { getStudentInitials } from '@/utils/attendance-formatters';
import { Phone } from 'lucide-react';
import { AttendanceControl } from './attendance-control';

export function AttendanceRosterCard({ record, value, disabled, onChange }: AttendanceRosterProps) {
  const initials = getStudentInitials(record.student.fullName);

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 p-3.5 backdrop-blur-xs transition-colors">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/70 text-xs font-semibold text-foreground border border-border/60">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{record.student.fullName}</p>
            <p className="font-mono text-xs text-muted-foreground">{record.student.studentCode}</p>
          </div>
        </div>

        {record.student.phone && (
          <a
            href={`tel:${record.student.phone}`}
            aria-label={`Call ${record.student.fullName}`}
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border/70 bg-muted/30 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
          >
            <Phone className="size-3.5" />
          </a>
        )}
      </div>

      <AttendanceControl value={value} disabled={disabled} onChange={onChange} />
    </div>
  );
}

