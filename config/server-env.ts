import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  BACKEND_API_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .refine(
      (value) => value === '/api/v1' || z.string().url().safeParse(value).success,
      'NEXT_PUBLIC_API_BASE_URL must be /api/v1 or an absolute URL.'
    )
    .optional(),
});

const values = envSchema.parse({
  BACKEND_API_BASE_URL: process.env.BACKEND_API_BASE_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

const backendApiBaseUrl =
  values.BACKEND_API_BASE_URL ??
  (values.NEXT_PUBLIC_API_BASE_URL === '/api/v1' ? undefined : values.NEXT_PUBLIC_API_BASE_URL);

if (!backendApiBaseUrl) {
  throw new Error('BACKEND_API_BASE_URL is required for server-side API requests.');
}

export const serverEnv = {
  apiBaseUrl: backendApiBaseUrl.replace(/\/$/, ''),
  backendBaseUrl: backendApiBaseUrl.replace(/\/api\/v1\/?$/, ''),
} as const;
