import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { history: true },
  });

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  return NextResponse.json(product);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.user.update({
    where: { clerkId: user.id },
    data: { products: { disconnect: { id: params.id } } },
  });

  return NextResponse.json({ success: true });
}
