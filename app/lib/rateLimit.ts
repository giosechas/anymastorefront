const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const store = new Map<string, number[]>();

export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  const timestamps = store.get(ip) ?? [];
  const valid = timestamps.filter((t) => now - t < WINDOW_MS);
  if (valid.length >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((valid[0] + WINDOW_MS - now) / 1000);
    store.set(ip, valid);
    return {allowed: false, retryAfter};
  }
  valid.push(now);
  store.set(ip, valid);
  return {allowed: true};
}
