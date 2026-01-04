import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env from packages/config directory
// When compiled, this file will be in packages/config/dist, so we go up one level
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const envSchema = z.object({
  UPSTASH_REDIS_REST_URL: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
});

console.log('process.env', process.env.UPSTASH_REDIS_REST_URL);

if (!envSchema.safeParse(process.env).success) {
  throw new Error('Invalid environment variables');
}

const env = envSchema.parse({
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export { env };
