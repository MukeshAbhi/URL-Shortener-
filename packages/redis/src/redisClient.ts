import { Redis } from '@upstash/redis';
import 'dotenv/config';

const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env;

let redis: Redis | undefined;

function getRedis() {
  if (!redis) {
    redis = new Redis({
      url: UPSTASH_REDIS_REST_URL,
      token: UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

export { getRedis };
