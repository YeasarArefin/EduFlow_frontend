import { apiRequest, ApiError } from '@/lib/api/client';

type HealthResponse = {
  status: string;
};

export const dynamic = 'force-dynamic';

export default async function HealthVerificationPage() {
  let payload: { data: HealthResponse } | { error: { message: string } };

  try {
    const health = await apiRequest<HealthResponse>('/health', {
      baseUrl: 'backend',
    });

    payload = { data: health };
  } catch (error) {
    const message = error instanceof ApiError ? error.message : 'Request failed';
    payload = { error: { message } };
  }

  return <pre>{JSON.stringify(payload, null, 2)}</pre>;
}
