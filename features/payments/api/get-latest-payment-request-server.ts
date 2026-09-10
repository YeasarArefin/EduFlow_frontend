import { headers } from 'next/headers';
import { env } from '@/config/env';
import type { LatestPaymentResponse, ServerLatestPaymentResult } from '@/types/payments';

export type { ServerLatestPaymentResult } from '@/types/payments';

export async function getLatestPaymentRequestServer(
  workspaceId: string
): Promise<ServerLatestPaymentResult> {
  const cookie = (await headers()).get('cookie') ?? '';

  try {
    const response = await fetch(`${env.apiBaseUrl}/payment-requests/latest`, {
      headers: {
        Accept: 'application/json',
        cookie,
        'X-Workspace-Id': workspaceId,
      },
      cache: 'no-store',
    });

    if (!response.ok) return { ok: false };

    const payload = (await response.json()) as LatestPaymentResponse;
    return { ok: true, payment: payload.data ?? null };
  } catch {
    return { ok: false };
  }
}
