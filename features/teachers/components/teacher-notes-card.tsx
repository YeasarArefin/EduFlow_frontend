import { SectionCard } from '@/components/dashboard/dashboard-primitives';
import type { TeacherNotesCardProps } from '@/types/teachers';

export function TeacherNotesCard({ notes }: TeacherNotesCardProps) {
  return (
    <SectionCard title="Notes & qualifications">
      <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{notes}</p>
    </SectionCard>
  );
}
