import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeProduct } from "@/lib/scraper";

export async function POST(req: Request) {
  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const scraped = await scrapeProduct(product.url);
  if (!scraped) return NextResponse.json({ error: "Failed to scrape product" }, { status: 400 });

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      previousPrice: product.currentPrice,
      currentPrice: scraped.price,
      history: { create: { price: scraped.price } },
    },
  });

  return NextResponse.json(updatedProduct);
}
