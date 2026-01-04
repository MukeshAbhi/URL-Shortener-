import { Redis } from '@upstash/redis';

let redis: Redis | undefined;

export function initRedis(config: {
  url: string;
  token: string;
}) {
  if (!redis) {
    redis = new Redis({
      url: config.url,
      token: config.token,
    });
  }
  return redis;
}

export function getRedis(): Redis {
  if (!redis) {
    throw new Error(
      'Redis not initialized. Call initRedis() at app startup.'
    );
  }
  return redis;
}
