import z from 'zod';

const envSchema = z.object({
  UPSTASH_REDIS_REST_URL: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
  MONGODB_URI: z.string(),
});

const validateEnv = () => {
  const env = envSchema.safeParse(process.env);
  if (!env.success) {
    throw new Error('Invalid environment variables');
  }
  return env.data;
};

export { validateEnv };

