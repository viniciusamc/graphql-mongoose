import { z } from 'zod';

const envSchema = z.object({
  MONGO_USERNAME: z.string(),
  MONGO_PASSWORD: z.string(),
  MONGO_HOST: z.string(),
  MONGO_PORT: z.string(),
  MONGO_DB_NAME: z.string(),
  PORT: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('validation error:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
