import { prisma } from "./prisma";
import { resolveGeo } from "./geo";

type LogLevel = "debug" | "info" | "warn" | "error";
type LogCategory = "api" | "auth" | "post" | "category" | "tag" | "setting" | "view" | "system";

interface LogOptions {
  level?: LogLevel;
  category: LogCategory;
  action: string;
  message: string;
  meta?: Record<string, unknown>;
  ip?: string;
  userId?: number;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LEVEL: LogLevel = process.env.LOG_LEVEL
  ? (process.env.LOG_LEVEL as LogLevel)
  : "info";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

const writeQueue: Promise<void>[] = [];
const MAX_QUEUE = 20;

async function flushQueue() {
  if (writeQueue.length >= MAX_QUEUE) {
    await Promise.all(writeQueue.splice(0, writeQueue.length));
  }
}

function writeLog(options: LogOptions) {
  if (!shouldLog(options.level ?? "info")) return;

  const ip = options.ip ?? null;

  // Sync geo resolution — ip2region is local, no network call
  let geo: string | null = null;
  if (ip && ip !== "unknown") {
    const geoInfo = resolveGeo(ip);
    geo = geoInfo ? JSON.stringify(geoInfo) : null;
  }

  const entry = {
    level: options.level ?? "info",
    category: options.category,
    action: options.action,
    message: options.message,
    meta: options.meta ? JSON.stringify(options.meta) : null,
    ip,
    geo,
    userId: options.userId ?? null,
  };

  const task = prisma.log
    .create({ data: entry })
    .then(() => {})
    .catch((err) => {
      console.error("[Logger] write failed:", err.message);
    });

  writeQueue.push(task);
  void flushQueue();
}

export const logger = {
  debug: (opts: Omit<LogOptions, "level">) => writeLog({ ...opts, level: "debug" }),
  info: (opts: Omit<LogOptions, "level">) => writeLog({ ...opts, level: "info" }),
  warn: (opts: Omit<LogOptions, "level">) => writeLog({ ...opts, level: "warn" }),
  error: (opts: Omit<LogOptions, "level">) => writeLog({ ...opts, level: "error" }),
};

export async function cleanOldLogs(retentionDays = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - retentionDays);
  const result = await prisma.log.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });
  return result.count;
}

export type { LogLevel, LogCategory, LogOptions };
