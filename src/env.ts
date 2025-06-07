import { z } from 'zod';

const envSchema = z.object({
  MONGODB_URL: z.string().url(),
  PORT: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('validation error:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
