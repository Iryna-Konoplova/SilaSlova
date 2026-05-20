const MAX_REQUESTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ENTRIES = 500;

type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

export function getClientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  pruneIfNeeded(now);

  const entry = buckets.get(ip);
  if (!entry || entry.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_REQUESTS) return true;
  entry.count += 1;
  return false;
}

function pruneIfNeeded(now: number) {
  if (buckets.size <= MAX_ENTRIES) return;
  for (const [ip, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(ip);
  }
  if (buckets.size > MAX_ENTRIES) {
    const toDelete = buckets.size - MAX_ENTRIES;
    let i = 0;
    for (const ip of buckets.keys()) {
      if (i >= toDelete) break;
      buckets.delete(ip);
      i++;
    }
  }
}
