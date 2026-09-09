import { SectionCard } from '@/components/dashboard-primitives';
import type { Teacher } from '../api/teachers';

function formatSalary(value: string) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0) / 100);
}

export function TeacherCompensationCard({ teacher }: { teacher: Teacher }) {
  return (
    <SectionCard title="Compensation">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Default base salary</span>
        <div className="text-2xl font-bold tracking-tight text-foreground">
          {formatSalary(teacher.defaultSalaryMinor)}
        </div>
        <p className="text-xs text-muted-foreground">
          Per cycle standard rate configured for this instructor.
        </p>
      </div>
    </SectionCard>
  );
}
