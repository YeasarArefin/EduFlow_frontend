import { apiRequest } from '@/lib/api/client';
import type { ActiveSession } from '@/types/settings';

export const getActiveSessions = (signal?: AbortSignal) =>
  apiRequest<ActiveSession[]>('/sessions', { signal });

export const revokeSession = (sessionId: string) =>
  apiRequest<void>(`/sessions/${sessionId}`, { method: 'DELETE' });

export const revokeOtherSessions = () => apiRequest<void>('/sessions/other', { method: 'DELETE' });
