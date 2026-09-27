import { serverEnv } from '@/config/server-env';

type HealthResponse = {
  status: string;
};

export const dynamic = 'force-dynamic';

export default async function HealthVerificationPage() {
  let payload: { data: HealthResponse } | { error: { message: string } };

  try {
    const response = await fetch(`${serverEnv.backendBaseUrl}/health`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Health request failed');
    payload = { data: (await response.json()) as HealthResponse };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Request failed';
    payload = { error: { message } };
  }

  return <pre>{JSON.stringify(payload, null, 2)}</pre>;
}
