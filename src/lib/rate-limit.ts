type Entry = { ts: number[] };

const store = new Map<string, Entry>();
let lastClean = Date.now();

/**
 * 桶数量硬上限。
 *
 * 每个访客 IP 至少占一个 key。没有上限的话，面对海量不同来源 IP
 * 时这个 Map 会无界增长，最终把进程内存吃干 —— 那本身就是一种 DoS。
 *
 * 达到上限时先做两级回收（过期桶 → 最不活跃桶），腾不出位置才放行：
 * 宁可漏限，也不能 OOM 拖垮整站。正常站点远达不到 2 万个并发 IP。
 */
const MAX_KEYS = 20_000;

/** 窗口上限：清理时按最宽窗口（60s）回收，保证短窗口的数据也不会被提前丢掉。 */
const MAX_WINDOW_MS = 60_000;

/** 回收窗口内已无任何请求的空桶。 */
function evictExpired(now: number): void {
  store.forEach((v, k) => {
    v.ts = v.ts.filter((t) => now - t < MAX_WINDOW_MS);
    if (!v.ts.length) store.delete(k);
  });
}

/**
 * 淘汰最久未活动的一批桶。
 *
 * 仅在桶数达到上限时触发，因此 O(n log n) 的开销可以接受 ——
 * 正常流量下永远不会走到这里。
 * 按"最后活动时间"升序淘汰，能保证活跃访客（包括正在被限流的攻击者）
 * 的计数不被清掉，只牺牲早已离开的僵尸条目。
 */
function evictLeastActive(ratio = 0.1): void {
  const victims = Math.max(1, Math.floor(store.size * ratio));
  const lastActive: Array<[string, number]> = [];
  store.forEach((v, k) => {
    lastActive.push([k, v.ts.length ? v.ts[v.ts.length - 1] : 0]);
  });
  lastActive.sort((a, b) => a[1] - b[1]);
  for (let i = 0; i < victims && i < lastActive.length; i++) {
    store.delete(lastActive[i][0]);
  }
}

function clean() {
  const now = Date.now();
  if (now - lastClean < MAX_WINDOW_MS) return;
  lastClean = now;
  evictExpired(now);
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
    if (store.size >= MAX_KEYS) {
      // 先回收过期桶；还满的话再淘汰最不活跃的一批。
      // 两级回收都做了仍然满，才说明真的是海量并发来源，此时放行自保。
      evictExpired(now);
      lastClean = now;
      if (store.size >= MAX_KEYS) {
        evictLeastActive();
        if (store.size >= MAX_KEYS) return true;
      }
    }
    e = { ts: [] };
    store.set(key, e);
  }
  e.ts = e.ts.filter((t) => now - t < windowMs);
  if (e.ts.length >= limit) return false;
  e.ts.push(now);
  return true;
}
