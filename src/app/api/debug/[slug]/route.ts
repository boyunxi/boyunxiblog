import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const chars = Array.from(params.slug, (c) => c.codePointAt(0)?.toString(16));
  return NextResponse.json({
    rawSlug: params.slug,
    url: request.url,
    pathname: new URL(request.url).pathname,
    chars,
  });
}
