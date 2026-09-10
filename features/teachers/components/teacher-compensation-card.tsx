import { SectionCard } from '@/components/dashboard/dashboard-primitives';
import type { TeacherCompensationCardProps } from '@/types/teachers';
import { formatTeacherSalaryMinor } from '@/utils/teacher-formatters';

export function TeacherCompensationCard({ teacher }: TeacherCompensationCardProps) {
  return (
    <SectionCard title="Compensation">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Default base salary</span>
        <div className="text-2xl font-bold tracking-tight text-foreground">
          {formatTeacherSalaryMinor(teacher.defaultSalaryMinor)}
        </div>
        <p className="text-xs text-muted-foreground">
          Per cycle standard rate configured for this instructor.
        </p>
      </div>
    </SectionCard>
  );
}
