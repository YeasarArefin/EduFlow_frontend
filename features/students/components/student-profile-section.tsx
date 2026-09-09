import { SectionCard } from '@/components/dashboard-primitives';
import { StatusBadge } from '@/components/status-badge';
import type { Student } from '../api/students';
import { StudentProfileDetailRow } from './student-profile-detail-row';

const statusLabels: Record<Student['status'], string> = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
};

const statusVisuals: Record<Student['status'], 'success' | 'warning' | 'info'> = {
  active: 'success',
  inactive: 'warning',
  archived: 'info',
};

function formatDate(value?: string | null): string {
  if (!value) return 'Not recorded';

  try {
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function StudentProfileSection({ student }: { student: Student }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <SectionCard title="Student Information">
        <dl className="divide-y divide-border/40 text-sm">
          <StudentProfileDetailRow label="Student Code">
            <span className="font-mono font-semibold">{student.studentCode}</span>
          </StudentProfileDetailRow>
          <StudentProfileDetailRow label="Full Name">
            <span className="font-semibold">{student.fullName}</span>
          </StudentProfileDetailRow>
          <StudentProfileDetailRow label="Phone">
            {student.phone ? (
              <a href={`tel:${student.phone}`} className="font-mono hover:underline">
                {student.phone}
              </a>
            ) : (
              'Not recorded'
            )}
          </StudentProfileDetailRow>
          <StudentProfileDetailRow label="Gender">
            <span className="capitalize">{student.gender || 'Not recorded'}</span>
          </StudentProfileDetailRow>
          <StudentProfileDetailRow label="Admission Date">
            {formatDate(student.admissionDate)}
          </StudentProfileDetailRow>
        </dl>
      </SectionCard>

      <SectionCard title="Guardian & Address Details">
        <dl className="divide-y divide-border/40 text-sm">
          <StudentProfileDetailRow label="Guardian Name">
            <span className="font-semibold">{student.guardianName || 'Not recorded'}</span>
          </StudentProfileDetailRow>
          <StudentProfileDetailRow label="Guardian Phone">
            {student.guardianPhone ? (
              <a href={`tel:${student.guardianPhone}`} className="font-mono hover:underline">
                {student.guardianPhone}
              </a>
            ) : (
              'Not recorded'
            )}
          </StudentProfileDetailRow>
          <StudentProfileDetailRow label="Address">
            {student.address || 'Not recorded'}
          </StudentProfileDetailRow>
          <StudentProfileDetailRow label="Status">
            <StatusBadge status={statusVisuals[student.status]}>
              {statusLabels[student.status]}
            </StatusBadge>
          </StudentProfileDetailRow>
        </dl>
      </SectionCard>

      <SectionCard title="Coaching Notes" className="md:col-span-2">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {student.notes || 'No internal notes recorded for this student.'}
        </p>
      </SectionCard>
    </div>
  );
}
