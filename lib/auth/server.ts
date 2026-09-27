import { headers } from 'next/headers';
import { serverEnv } from '@/config/server-env';

export type ServerSession = {
  user?: { id: string; name?: string | null; email?: string | null; emailVerified?: boolean };
};

export async function getServerSession(): Promise<ServerSession | null> {
  const cookie = (await headers()).get('cookie');
  if (!cookie) return null;
  const response = await fetch(`${serverEnv.backendBaseUrl}/api/auth/get-session`, {
    headers: { cookie },
    cache: 'no-store',
  });
  return response.ok ? ((await response.json()) as ServerSession) : null;
}
