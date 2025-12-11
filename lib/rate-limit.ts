type RateLimitBucket = {
  tokens: number;
  last: number;
};

const bucket: Record<string, RateLimitBucket> = {};

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
const max = parseInt(process.env.RATE_LIMIT_MAX || '60', 10);

export function rateLimit(key: string) {
  const now = Date.now();
  const entry = bucket[key] || { tokens: max, last: now };
  const elapsed = now - entry.last;
  const refill = Math.floor((elapsed / windowMs) * max);
  entry.tokens = Math.min(max, entry.tokens + refill);
  entry.last = now;
  if (entry.tokens <= 0) {
    bucket[key] = entry;
    return false;
  }
  entry.tokens -= 1;
  bucket[key] = entry;
  return true;
}

