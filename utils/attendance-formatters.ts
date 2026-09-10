import type { AttendanceSessionStatus } from '@/types/attendance';

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function formatAttendanceDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

export function getAttendanceStatusBadge(status: AttendanceSessionStatus) {
  return status === 'finalized' ? 'success' : 'warning';
}

export function getAttendanceStatusLabel(status: AttendanceSessionStatus) {
  return status === 'finalized' ? 'Finalized' : 'Draft';
}
