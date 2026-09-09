import type { AttendanceRecord, AttendanceRecordStatus } from '../api/attendance';
import { AttendanceControl } from './attendance-control';

export function AttendanceRosterRow({
  record,
  value,
  disabled,
  onChange,
}: {
  record: AttendanceRecord;
  value: AttendanceRecordStatus;
  disabled: boolean;
  onChange: (status: AttendanceRecordStatus) => void;
}) {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)_250px] items-center gap-4 border-b border-border/70 px-4 py-3 last:border-b-0">
      <span className="font-mono text-xs text-muted-foreground">{record.student.studentCode}</span>
      <span className="truncate font-medium text-foreground">{record.student.fullName}</span>
      <AttendanceControl value={value} disabled={disabled} onChange={onChange} />
    </div>
  );
}
