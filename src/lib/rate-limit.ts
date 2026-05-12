const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 6;

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

export function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

export function checkRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(identifier);

  if (!existing || existing.resetAt <= now) {
    buckets.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true };
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return { allowed: true };
}

export function resetRateLimitForTests() {
  buckets.clear();
}
