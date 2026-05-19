import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

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

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";

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
