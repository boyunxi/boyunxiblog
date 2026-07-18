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
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, slug } = body;

    const category = await prisma.category.update({
      where: { id: parseInt(params.id) },
      data: { name, slug },
    });

    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath(`/categories/${category.slug}`);

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
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

    const category = await prisma.category.findUnique({
      where: { id: parseInt(params.id) },
      select: { slug: true },
    });

    await prisma.post.updateMany({
      where: { categoryId: parseInt(params.id) },
      data: { categoryId: null },
    });

    await prisma.category.delete({ where: { id: parseInt(params.id) } });

    if (category) {
      revalidatePath("/");
      revalidatePath("/categories");
      revalidatePath(`/categories/${category.slug}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
});
