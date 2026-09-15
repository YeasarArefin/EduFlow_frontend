import { SectionCard } from '@/components/dashboard/dashboard-primitives';
import { StatusBadge } from '@/components/status/status-badge';
import type { StudentProfileSectionProps } from '@/types/students';
import { StudentProfileDetailRow } from './student-profile-detail-row';
import { formatStudentDate, getStudentStatusVisual } from '@/utils/student-formatters';

export function StudentProfileSection({ student }: StudentProfileSectionProps) {
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
          <StudentProfileDetailRow label="Email">
            {student.email ? (
              <a href={`mailto:${student.email}`} className="break-all hover:underline">
                {student.email}
              </a>
            ) : (
              'Not recorded'
            )}
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
            {formatStudentDate(student.admissionDate)}
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
            <StatusBadge status={getStudentStatusVisual(student.status).tone}>
              {getStudentStatusVisual(student.status).label}
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
