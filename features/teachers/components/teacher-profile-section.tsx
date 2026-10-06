import { SectionCard } from '@/components/dashboard/dashboard-primitives';
import { StatusBadge } from '@/components/status/status-badge';
import type { TeacherProfileSectionProps } from '@/types/teachers';
import {
  formatTeacherDate,
  formatTeacherSalaryMinor,
  getTeacherStatusVisual,
} from '@/utils/teacher-formatters';

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-3">
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="col-span-2 text-foreground">{children}</dd>
    </div>
  );
}

export function TeacherProfileSection({ teacher }: TeacherProfileSectionProps) {
  const statusVisual = getTeacherStatusVisual(teacher.status);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <SectionCard title="Teacher & Academic Information">
        <dl className="divide-y divide-border/40 text-sm">
          <DetailRow label="Teacher Code">
            <span className="font-mono font-semibold">{teacher.teacherCode}</span>
          </DetailRow>
          <DetailRow label="Full Name">
            <span className="font-semibold">{teacher.name}</span>
          </DetailRow>
          <DetailRow label="Phone">
            {teacher.phone ? (
              <a href={`tel:${teacher.phone}`} className="font-mono hover:underline">
                {teacher.phone}
              </a>
            ) : (
              'Not recorded'
            )}
          </DetailRow>
          <DetailRow label="Email">
            {teacher.email ? (
              <a href={`mailto:${teacher.email}`} className="font-mono hover:underline">
                {teacher.email}
              </a>
            ) : (
              'Not recorded'
            )}
          </DetailRow>
          <DetailRow label="Subject Specialty">
            {teacher.subjectSpecialty ? (
              <span className="inline-flex items-center rounded-md border border-lime-500/30 bg-lime-500/10 px-2 py-0.5 text-xs font-medium text-lime-400">
                {teacher.subjectSpecialty}
              </span>
            ) : (
              'General / Unassigned'
            )}
          </DetailRow>
        </dl>
      </SectionCard>

      <SectionCard title="Compensation & Account Status">
        <dl className="divide-y divide-border/40 text-sm">
          <DetailRow label="Base Monthly Salary">
            <span className="font-mono font-semibold text-foreground">
              {formatTeacherSalaryMinor(teacher.defaultSalaryMinor)}
            </span>
          </DetailRow>
          <DetailRow label="Current Status">
            <StatusBadge status={statusVisual.tone}>{statusVisual.label}</StatusBadge>
          </DetailRow>
          <DetailRow label="Profile Created">{formatTeacherDate(teacher.createdAt)}</DetailRow>
          <DetailRow label="Last Updated">{formatTeacherDate(teacher.updatedAt)}</DetailRow>
        </dl>
      </SectionCard>

      <SectionCard title="Teacher Notes & Qualifications" className="md:col-span-2">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {teacher.notes || 'No internal notes or qualifications recorded for this instructor.'}
        </p>
      </SectionCard>
    </div>
  );
}
