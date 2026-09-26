import { z } from 'zod';

export const queueSmsMessageSchema = z
  .object({
    body: z.string().trim().min(1).max(10000),
    target: z.enum(['student', 'guardian', 'both']),
    studentIds: z.array(z.string().uuid()).optional(),
    customNumbers: z.array(z.string().trim().min(6).max(30)).optional(),
  })
  .refine(
    (value) => (value.studentIds?.length ?? 0) + (value.customNumbers?.length ?? 0) > 0,
    'Select at least one recipient.'
  );
