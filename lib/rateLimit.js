// Minimal in-memory sliding-window limiter, no extra dependency. This is
// per-server-instance, so it's a basic abuse deterrent rather than a
// distributed-systems-grade guarantee — fine at this project's scale. If
// the app ever runs multi-instance, swap the Map below for a shared store
// (e.g. Redis/Upstash) without changing the call sites.
const hits = new Map();

export function isRateLimited(key, { limit, windowMs }) {
    const now = Date.now();
    const timestamps = (hits.get(key) || []).filter((t) => now - t < windowMs);

    if (timestamps.length >= limit) {
        hits.set(key, timestamps);
        return true;
    }

    timestamps.push(now);
    hits.set(key, timestamps);
    return false;
}
