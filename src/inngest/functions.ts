import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { scrapeProduct } from "@/lib/scraper";
import { sendPriceDropEmail } from "@/lib/resend";

export const checkPrices = inngest.createFunction(
  {
    id: "check-prices",
    triggers: [{ cron: "0 */8 * * *" }],
  },
  async ({ step }) => {
    const products = await step.run("fetch-products", async () => {
      return await prisma.product.findMany({
        include: {
          users: true,
        },
      });
    });

    for (const product of products) {
      await step.run(`check-price-${product.id}`, async () => {
        const scraped = await scrapeProduct(product.url);
        if (!scraped) return;

        if (scraped.price < product.currentPrice) {
          // Price dropped!
          await prisma.product.update({
            where: { id: product.id },
            data: {
              previousPrice: product.currentPrice,
              currentPrice: scraped.price,
              history: {
                create: { price: scraped.price },
              },
            },
          });

          // Send alerts to all users tracking this product
          for (const user of product.users) {
            await sendPriceDropEmail(
              user.email,
              product.title,
              product.currentPrice,
              scraped.price,
              product.url
            );
          }
        } else if (scraped.price !== product.currentPrice) {
          // Price changed but not dropped (or just update history)
          await prisma.product.update({
            where: { id: product.id },
            data: {
              currentPrice: scraped.price,
              history: {
                create: { price: scraped.price },
              },
            },
          });
        }
      });
    }
  }
);
