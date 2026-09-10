import type { AcademicResource } from '@/types/settings';

export const academicResourceLabels: Record<
  AcademicResource,
  { singular: string; plural: string }
> = {
  'class-levels': { singular: 'Class', plural: 'Classes' },
  mediums: { singular: 'Medium', plural: 'Mediums' },
  'academic-groups': { singular: 'Group', plural: 'Groups' },
};

export function getSettingsErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Could not save this reference.';
}
