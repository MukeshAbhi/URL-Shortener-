import { getRedis } from '@url-shortener/redis';

/**
 * Token bucket rate limiter (atomic via Lua)
 *
 * @param key Unique identifier (ip, userId, etc)
 * @param capacity Max tokens in the bucket
 * @param refillRate Tokens added per second
 */
export async function rateLimit(
  key: string,
  capacity: number,
  refillRate: number
): Promise<{ allowed: boolean; remaining: number }> {
  // Get Redis instance (lazy initialization)
  const redis = getRedis();

  // Current timestamp in seconds
  const now = Math.floor(Date.now() / 1000);

  // Lua script executed atomically inside Redis
  const lua = `
    -- Read input arguments
    local key = KEYS[1]
    local capacity = tonumber(ARGV[1])
    local refillRate = tonumber(ARGV[2])
    local now = tonumber(ARGV[3])

    -- Fetch current token count and last updated timestamp
    local bucket = redis.call("HMGET", key, "tokens", "timestamp")
    local tokens = tonumber(bucket[1])
    local last = tonumber(bucket[2])

    -- Initialize bucket if it does not exist
    if tokens == nil then
      tokens = capacity
      last = now
    end

    -- Calculate how many seconds passed since last update
    local delta = math.max(0, now - last)

    -- Refill tokens based on elapsed time, capped at capacity
    tokens = math.min(capacity, tokens + delta * refillRate)

    -- Check if at least one token is available
    local allowed = tokens >= 1

    -- If allowed, consume one token
    if allowed then
      tokens = tokens - 1
    end

    -- Persist updated token count and timestamp
    redis.call("HMSET", key, "tokens", tokens, "timestamp", now)

    -- Set TTL so inactive buckets expire automatically
    redis.call("EXPIRE", key, math.ceil(capacity / refillRate))

    -- Return whether request is allowed and remaining tokens
    return { allowed and 1 or 0, tokens }
  `;

  // Execute Lua script with Redis (atomic operation)
  const [allowed, remaining] = (await redis.eval(
    lua,
    [key],                     // Redis keys
    [capacity, refillRate, now] // Script arguments
  )) as [number, number];

  return {
    allowed: allowed === 1,
    remaining,
  };
}
