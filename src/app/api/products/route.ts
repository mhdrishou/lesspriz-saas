import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { scrapeProduct } from "@/lib/scraper";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { products: true },
  });

  return NextResponse.json(dbUser?.products || []);
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  try {
    let product = await prisma.product.findUnique({ where: { url } });

    if (!product) {
      const scraped = await scrapeProduct(url);
      if (!scraped) return NextResponse.json({ error: "Failed to scrape product" }, { status: 400 });

      product = await prisma.product.create({
        data: {
          url: scraped.url,
          title: scraped.title,
          image: scraped.image,
          currentPrice: scraped.price,
          currency: scraped.currency,
          history: { create: { price: scraped.price } },
        },
      });
    }

    await prisma.user.update({
      where: { clerkId: user.id },
      data: { products: { connect: { id: product.id } } },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
