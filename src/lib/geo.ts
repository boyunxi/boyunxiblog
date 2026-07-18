import IP2Region from "ip2region";
import path from "path";
import fs from "fs";

export interface GeoInfo {
  country: string;
  region: string;
  city: string;
  isp: string;
}

let query: IP2Region | null = null;

function getQuery(): IP2Region {
  if (!query) {
    const ipv4db = [
      path.resolve(process.cwd(), "node_modules/ip2region/data/ip2region.db"),
      path.resolve(process.cwd(), "data/ip2region.db"),
    ].find((p) => fs.existsSync(p));

    const ipv6db = [
      path.resolve(process.cwd(), "node_modules/ip2region/data/ipv6wry.db"),
      path.resolve(process.cwd(), "data/ipv6wry.db"),
    ].find((p) => fs.existsSync(p));

    query = new IP2Region({ ipv4db, ipv6db });
  }
  return query;
}

function isPrivateIp(ip: string): boolean {
  if (ip === "unknown" || ip === "127.0.0.1" || ip === "::1" || ip === "localhost") return true;
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4) return false;
  if (parts[0] === 10) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  return false;
}

export function resolveGeo(ip: string): GeoInfo | null {
  if (isPrivateIp(ip)) return null;
  try {
    const res = getQuery().search(ip);
    if (!res || !res.country) return null;
    return {
      country: res.country || "未知",
      region: res.province || "未知",
      city: res.city || "未知",
      isp: res.isp || "未知",
    };
  } catch {
    return null;
  }
}
