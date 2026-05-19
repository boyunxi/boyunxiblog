type Entry = { ts: number[] };

const store = new Map<string, Entry>();
let lastClean = Date.now();

function clean() {
  const now = Date.now();
  if (now - lastClean < 60_000) return;
  lastClean = now;
  store.forEach((v, k) => {
    v.ts = v.ts.filter((t) => now - t < 60_000);
    if (!v.ts.length) store.delete(k);
  });
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs = 60_000
): boolean {
  clean();
  const now = Date.now();
  let e = store.get(key);
  if (!e) {
    e = { ts: [] };
    store.set(key, e);
  }
  e.ts = e.ts.filter((t) => now - t < windowMs);
  if (e.ts.length >= limit) return false;
  e.ts.push(now);
  return true;
}
