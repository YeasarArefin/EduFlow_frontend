import { apiRequest } from '@/lib/api/client';

export const academicResources = ['class-levels', 'mediums', 'academic-groups'] as const;
export type AcademicResource = (typeof academicResources)[number];
export type AcademicReference = { id: string; name: string; isActive: boolean };
const headers = (workspaceId: string) => ({ 'X-Workspace-Id': workspaceId });

export function getAcademicReferences(
  workspaceId: string,
  resource: AcademicResource,
  signal?: AbortSignal
) {
  return apiRequest<AcademicReference[]>(`/academic/${resource}`, {
    headers: headers(workspaceId),
    signal,
  });
}
export function createAcademicReference(
  workspaceId: string,
  resource: AcademicResource,
  name: string
) {
  return apiRequest<AcademicReference>(`/academic/${resource}`, {
    method: 'POST',
    headers: headers(workspaceId),
    body: { name },
  });
}
export function renameAcademicReference(
  workspaceId: string,
  resource: AcademicResource,
  id: string,
  name: string
) {
  return apiRequest<AcademicReference>(`/academic/${resource}/${id}`, {
    method: 'PATCH',
    headers: headers(workspaceId),
    body: { name },
  });
}
export function setAcademicReferenceStatus(
  workspaceId: string,
  resource: AcademicResource,
  id: string,
  isActive: boolean
) {
  return apiRequest<AcademicReference>(`/academic/${resource}/${id}/status`, {
    method: 'PATCH',
    headers: headers(workspaceId),
    body: { isActive },
  });
}
