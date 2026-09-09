import { headers } from 'next/headers';
import { env } from '@/config/env';

export type ServerSession = { user?: { id: string; name?: string | null; email?: string | null } };

export async function getServerSession(): Promise<ServerSession | null> {
  const cookie = (await headers()).get('cookie');
  if (!cookie) return null;
  const response = await fetch(`${env.authBaseUrl}/get-session`, {
    headers: { cookie },
    cache: 'no-store',
  });
  return response.ok ? ((await response.json()) as ServerSession) : null;
}
