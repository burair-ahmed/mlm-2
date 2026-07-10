import { NextRequest } from "next/server";

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up old rate limit records to prevent memory leaks
if (typeof global !== 'undefined') {
  const intervalKey = '_rateLimitCleanupInterval';
  const g = global as typeof global & { [key: string]: NodeJS.Timeout | undefined };
  if (!g[intervalKey]) {
    g[intervalKey] = setInterval(() => {
      const now = Date.now();
      for (const [key, record] of rateLimitMap.entries()) {
        record.timestamps = record.timestamps.filter(t => now - t < 60 * 60 * 1000);
        if (record.timestamps.length === 0) {
          rateLimitMap.delete(key);
        }
      }
    }, 60 * 60 * 1000); // hourly cleanup
  }
}

export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return '127.0.0.1';
}

export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; limit: number; remaining: number } {
  const now = Date.now();
  let record = rateLimitMap.get(key);
  
  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(key, record);
  }

  // Filter out timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
    };
  }

  record.timestamps.push(now);
  return {
    success: true,
    limit,
    remaining: limit - record.timestamps.length,
  };
}
