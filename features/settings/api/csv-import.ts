import { apiRequest } from '@/lib/api/client';
import { env } from '@/config/env';
import type { CsvImportKind, CsvImportSummary } from '@/types/settings';
const headers = (workspaceId: string) => ({ 'X-Workspace-Id': workspaceId });
const path = (kind: CsvImportKind) => (kind === 'students' ? '/students/import' : '/teachers/import');
export const previewCsvImport = (workspaceId: string, kind: CsvImportKind, csv: string) => apiRequest<CsvImportSummary>(`${path(kind)}/preview`, { method: 'POST', headers: headers(workspaceId), body: { csv } });
export const confirmCsvImport = (workspaceId: string, kind: CsvImportKind, csv: string) => apiRequest<CsvImportSummary>(path(kind), { method: 'POST', headers: headers(workspaceId), body: { csv } });
export const downloadCsvTemplate = async (workspaceId: string, kind: CsvImportKind) => { const response = await fetch(`${env.apiBaseUrl}${path(kind)}/template`, { credentials: 'include', headers: headers(workspaceId) }); if (!response.ok) throw new Error('Could not download template.'); return response.text(); };
