import { cn } from '@/lib/utils';
import type { AttendanceControlProps } from '@/types/attendance';
import { Check, X } from 'lucide-react';

export function AttendanceControl({ value, disabled, onChange }: AttendanceControlProps) {
  return (
    <div
      className="inline-flex w-full items-center rounded-xl border border-border/80 bg-muted/20 p-1 transition-colors"
      role="group"
      aria-label="Attendance status selection"
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('present')}
        className={cn(
          'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 px-3 text-xs font-semibold tracking-tight transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60',
          value === 'present'
            ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/25 font-bold'
            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
        )}
      >
        <Check className={cn('size-3.5', value === 'present' ? 'stroke-[2.5]' : 'opacity-70')} />
        <span>Present</span>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('absent')}
        className={cn(
          'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 px-3 text-xs font-semibold tracking-tight transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60',
          value === 'absent'
            ? 'bg-destructive/15 text-destructive border border-destructive/30 font-bold'
            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
        )}
      >
        <X className={cn('size-3.5', value === 'absent' ? 'stroke-[2.5]' : 'opacity-70')} />
        <span>Absent</span>
      </button>
    </div>
  );
}
