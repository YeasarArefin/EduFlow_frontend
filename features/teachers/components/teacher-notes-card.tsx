import { SectionCard } from '@/components/dashboard-primitives';

export function TeacherNotesCard({ notes }: { notes: string }) {
  return (
    <SectionCard title="Notes & qualifications">
      <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{notes}</p>
    </SectionCard>
  );
}
