import { z } from 'zod';

const apiBaseUrlSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === '/api/v1' || z.string().url().safeParse(value).success,
    'NEXT_PUBLIC_API_BASE_URL must be /api/v1 or an absolute URL.'
  );

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: apiBaseUrlSchema.default('/api/v1'),
});

const apiBaseUrl = envSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
}).NEXT_PUBLIC_API_BASE_URL;

export const env = {
  apiBaseUrl: apiBaseUrl.replace(/\/$/, ''),
  backendBaseUrl: apiBaseUrl.replace(/\/api\/v1\/?$/, ''),
} as const;
