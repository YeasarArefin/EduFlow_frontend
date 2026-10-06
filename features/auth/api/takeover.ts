import { apiRequest } from '@/lib/api/client';
import type { SessionTakeoverInput } from '@/types/auth';

export const sessionTakeover = (input: SessionTakeoverInput) =>
  apiRequest<{
    user: { id: string; email: string; emailVerified: boolean; name: string };
    session: { id: string; userId: string };
  }>('/sessions/takeover', {
    method: 'POST',
    body: input,
  });
