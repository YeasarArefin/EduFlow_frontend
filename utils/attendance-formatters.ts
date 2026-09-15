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

export function getAttendancePercentage(present: number, total: number): number {
  if (!total || total <= 0) return 0;
  return Math.round((present / total) * 100);
}

export function getStudentInitials(fullName: string): string {
  if (!fullName) return 'ST';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatClassDaysShort(classDays: number[] = []): string {
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayLabels.filter((_, idx) => classDays.includes(idx)).join(', ') || 'No days';
}

export function formatDateNumeric(date: string): string {
  if (!date) return '';
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

export function getLatestClassDateForBatch(classDays: number[] = []): string {
  const today = getTodayDate();
  if (!classDays.length) return today;
  const d = new Date();
  for (let i = 0; i < 7; i++) {
    if (classDays.includes(d.getDay())) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    d.setDate(d.getDate() - 1);
  }
  return today;
}


