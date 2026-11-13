import { headers } from "next/headers";

interface RateLimitRecord {
  count: number;
  resetTime: number; // Unix timestamp in ms
}

// Global in-memory storage for rate limits
// Using globalThis to preserve store across hot reloads in development
const globalRateLimitStore = (globalThis as unknown as {
  __rateLimitStore?: Map<string, RateLimitRecord>;
});

const rateLimitStore = globalRateLimitStore.__rateLimitStore || new Map<string, RateLimitRecord>();
if (!globalRateLimitStore.__rateLimitStore) {
  globalRateLimitStore.__rateLimitStore = rateLimitStore;
}

// Clean up expired entries every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}

/**
 * Extracts client IP from incoming request headers in Server Actions
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return (
    headersList.get("x-real-ip") ||
    headersList.get("cf-connecting-ip") ||
    headersList.get("true-client-ip") ||
    "127.0.0.1"
  );
}

/**
 * Core rate limit check function
 * @param key Unique identifier (e.g. `login:192.168.1.1`)
 * @param limit Maximum allowed attempts within window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // New window
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, newRecord);
    return {
      success: true,
      remaining: limit - 1,
      resetTime: newRecord.resetTime,
    };
  }

  if (record.count >= limit) {
    // Limit exceeded
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  // Increment counter
  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Convenience rate limit wrapper for auth endpoints
 * Default: 5 attempts per 15 minutes per IP
 */
export async function checkAuthRateLimit(
  action: "login" | "signup",
  maxAttempts: number = 5,
  windowMinutes: number = 15
): Promise<{ success: boolean; error?: string }> {
  const ip = await getClientIp();
  const key = `auth:${action}:${ip}`;
  const windowMs = windowMinutes * 60 * 1000;

  const result = checkRateLimit(key, maxAttempts, windowMs);

  if (!result.success) {
    const minutesRemaining = Math.max(
      1,
      Math.ceil((result.resetTime - Date.now()) / (60 * 1000))
    );
    return {
      success: false,
      error: `Security threshold exceeded: Too many ${action} attempts from your IP. Please try again in ${minutesRemaining} minute(s).`,
    };
  }

  return { success: true };
}
