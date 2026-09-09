import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default('http://localhost:4000/api/v1'),
});

const apiBaseUrl = envSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
}).NEXT_PUBLIC_API_BASE_URL;

export const env = {
  apiBaseUrl: apiBaseUrl.replace(/\/$/, ''),
  backendBaseUrl: apiBaseUrl.replace(/\/api\/v1\/?$/, ''),
  authBaseUrl: `${apiBaseUrl.replace(/\/api\/v1\/?$/, '')}/api/auth`,
} as const;
