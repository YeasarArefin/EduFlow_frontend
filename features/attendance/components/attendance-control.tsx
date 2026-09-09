import type { AttendanceRecordStatus } from '../api/attendance';
import { cn } from '@/lib/utils';

export function AttendanceControl({
  value,
  disabled,
  onChange,
}: {
  value: AttendanceRecordStatus;
  disabled: boolean;
  onChange: (status: AttendanceRecordStatus) => void;
}) {
  return (
    <div
      className="grid grid-cols-2 overflow-hidden rounded-lg border border-border-strong"
      role="group"
      aria-label="Attendance status"
    >
      {(['present', 'absent'] as const).map((status) => (
        <button
          key={status}
          type="button"
          disabled={disabled}
          onClick={() => onChange(status)}
          className={cn(
            'min-h-10 px-3 text-sm font-medium capitalize transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-70',
            status === 'present' ? 'border-r border-border' : '',
            value === status
              ? status === 'present'
                ? 'bg-primary text-primary-foreground'
                : 'bg-destructive/15 text-destructive'
              : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
