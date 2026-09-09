import { AcademicReferenceCard } from './academic-reference-card';

export function AcademicSetup({ workspaceId }: { workspaceId: string }) {
  return (
    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
      <AcademicReferenceCard
        workspaceId={workspaceId}
        resource="class-levels"
        title="Class Levels"
        description="Define the classes taught by your coaching center."
      />
      <AcademicReferenceCard
        workspaceId={workspaceId}
        resource="mediums"
        title="Mediums"
        description="Define the academic mediums your center supports."
      />
      <AcademicReferenceCard
        workspaceId={workspaceId}
        resource="academic-groups"
        title="Academic Groups"
        description="Define group options such as Science or Business Studies."
      />
    </div>
  );
}
