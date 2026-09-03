import { NextRequest, NextResponse } from "next/server";
import { checkLockout } from "@/lib/login-guard";
import { getClientIp } from "@/lib/client-ip";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request.headers, request.ip);
  const { locked, remainingMs } = checkLockout(ip);
  return NextResponse.json({ locked, remainingMs });
}
