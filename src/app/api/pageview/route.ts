import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getClientIp } from "@/lib/client-ip";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, referrer } = body;

    if (!path || typeof path !== "string") {
      return NextResponse.json(
        { success: false, error: "path is required" },
        { status: 400 }
      );
    }

    const ip = getClientIp(request.headers);

    void logger.info({
      category: "view",
      action: "page_view",
      message: `访问: ${path}`,
      meta: { path, referrer: referrer || null },
      ip,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
