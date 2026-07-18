import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withLog } from "@/lib/with-log";
import { revalidatePath } from "next/cache";

export const PUT = withLog(async (
  request,
  { params }: { params: { id: string } }
) => {
  try {
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    const { generateSlug } = await import("@/lib/utils");
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;
    const slug = generateSlug(name);

    const tag = await prisma.tag.update({
      where: { id: parseInt(params.id) },
      data: { name, slug },
    });

    revalidatePath("/");
    revalidatePath("/tags");
    revalidatePath(`/tags/${tag.slug}`);

    return NextResponse.json({ success: true, data: tag });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update tag" },
      { status: 500 }
    );
  }
});

export const DELETE = withLog(async (
  request,
  { params }: { params: { id: string } }
) => {
  try {
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as Record<string, unknown>).role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tag = await prisma.tag.findUnique({
      where: { id: parseInt(params.id) },
      select: { slug: true },
    });

    await prisma.tag.delete({ where: { id: parseInt(params.id) } });

    if (tag) {
      revalidatePath("/");
      revalidatePath("/tags");
      revalidatePath(`/tags/${tag.slug}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete tag" },
      { status: 500 }
    );
  }
});
