import { apiRequest } from '@/lib/api/client';
import type { ActiveSession } from '@/types/settings';
import type { SessionTakeoverInput } from '@/types/auth';

export const getActiveSessions = (signal?: AbortSignal) =>
  apiRequest<ActiveSession[]>('/sessions', { signal });

export const revokeSession = (sessionId: string) =>
  apiRequest<void>(`/sessions/${sessionId}`, { method: 'DELETE' });

export const revokeOtherSessions = () =>
  apiRequest<void>('/sessions/other', { method: 'DELETE' });

export const sessionTakeover = (input: SessionTakeoverInput) =>
  apiRequest<{
    user: { id: string; email: string; emailVerified: boolean; name: string };
    session: { id: string; userId: string };
  }>('/sessions/takeover', {
    method: 'POST',
    body: input,
  });
