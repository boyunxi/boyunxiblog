type Entry = { fails: number; lockedUntil: number };

const store = new Map<string, Entry>();
let lastClean = Date.now();

function clean() {
  const now = Date.now();
  if (now - lastClean < 300_000) return;
  lastClean = now;
  store.forEach((e, ip) => {
    if (e.lockedUntil > 0 && e.lockedUntil < now) {
      store.delete(ip);
    }
  });
}

function lockoutMs(fails: number): number {
  if (fails >= 15) return 3_600_000;
  if (fails >= 10) return 1_500_000;
  if (fails >= 5) return 300_000;
  return 0;
}

export function checkLockout(ip: string): { locked: boolean; remainingMs: number } {
  clean();
  const e = store.get(ip);
  if (!e) return { locked: false, remainingMs: 0 };
  const now = Date.now();
  if (e.lockedUntil > now) return { locked: true, remainingMs: e.lockedUntil - now };
  return { locked: false, remainingMs: 0 };
}

export function recordFail(ip: string): { locked: boolean; remainingMs: number } {
  clean();
  let e = store.get(ip);
  if (!e) {
    e = { fails: 0, lockedUntil: 0 };
    store.set(ip, e);
  }
  const now = Date.now();
  if (e.lockedUntil > now) return { locked: true, remainingMs: e.lockedUntil - now };
  e.fails++;
  const ms = lockoutMs(e.fails);
  if (ms) {
    e.lockedUntil = now + ms;
    return { locked: true, remainingMs: ms };
  }
  return { locked: false, remainingMs: 0 };
}

export function recordSuccess(ip: string): void {
  store.delete(ip);
}
