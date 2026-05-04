"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { scrapeProduct } from "@/lib/scraper";
import { currentUser } from "@clerk/nextjs/server";

export async function addProduct(url: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  // Check if product exists
  let product = await prisma.product.findUnique({
    where: { url },
  });

  if (!product) {
    const scrapedProduct = await scrapeProduct(url);
    if (!scrapedProduct) throw new Error("Failed to scrape product");

    product = await prisma.product.create({
      data: {
        url: scrapedProduct.url,
        title: scrapedProduct.title,
        image: scrapedProduct.image,
        description: scrapedProduct.description,
        category: scrapedProduct.category,
        outOfStock: scrapedProduct.outOfStock,
        currentPrice: scrapedProduct.price,
        currency: scrapedProduct.currency,
        history: {
          create: {
            price: scrapedProduct.price,
          },
        },
      },
    });
  } else {
    // Optionally update existing product details
    const scrapedProduct = await scrapeProduct(url);
    if (scrapedProduct) {
        product = await prisma.product.update({
            where: { id: product.id },
            data: {
                title: scrapedProduct.title,
                image: scrapedProduct.image,
                description: scrapedProduct.description,
                category: scrapedProduct.category,
                outOfStock: scrapedProduct.outOfStock,
            }
        });
    }
  }

  // Associate product with user
  await prisma.user.update({
    where: { clerkId: user.id },
    data: {
      products: {
        connect: { id: product.id },
      },
    },
  });

  revalidatePath("/dashboard");
}

export async function getProducts() {
  const user = await currentUser();
  if (!user) return [];

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      products: {
        include: {
          history: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      },
    },
  });

  return dbUser?.products || [];
}

export async function deleteProduct(productId: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { clerkId: user.id },
    data: {
      products: {
        disconnect: { id: productId },
      },
    },
  });

  revalidatePath("/dashboard");
}

export async function syncUser() {
  const user = await currentUser();
  if (!user) return null;

  const dbUser = await prisma.user.upsert({
    where: { clerkId: user.id },
    update: {
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
    },
    create: {
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
    },
  });

  return dbUser;
}
