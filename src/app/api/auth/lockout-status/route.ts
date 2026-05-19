import { NextRequest, NextResponse } from "next/server";
import { checkLockout } from "@/lib/login-guard";

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const { locked, remainingMs } = checkLockout(ip);
  return NextResponse.json({ locked, remainingMs });
}
