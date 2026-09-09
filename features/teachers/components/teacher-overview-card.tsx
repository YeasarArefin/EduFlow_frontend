import { SectionCard } from '@/components/dashboard-primitives';
import { StatusBadge } from '@/components/status-badge';
import type { Teacher } from '../api/teachers';

export function TeacherOverviewCard({ teacher }: { teacher: Teacher }) {
  return (
    <SectionCard title="Teacher overview">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <StatusBadge
            status={
              teacher.status === 'active'
                ? 'success'
                : teacher.status === 'inactive'
                  ? 'warning'
                  : 'info'
            }
          >
            {teacher.status}
          </StatusBadge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Teacher code</span>
          <span className="font-mono font-medium text-foreground">{teacher.teacherCode}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Specialization</span>
          <span className="font-medium text-foreground">
            {teacher.subjectSpecialty ?? 'Not specified'}
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
