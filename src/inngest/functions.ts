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
          users: {
            include: {
              alerts: true,
            },
          },
        },
      });
    });

    for (const product of products) {
      await step.run(`check-price-${product.id}`, async () => {
        const scraped = await scrapeProduct(product.url);
        if (!scraped) return;

        const isPriceLower = scraped.price < product.currentPrice;
        
        // Update product in DB
        await prisma.product.update({
          where: { id: product.id },
          data: {
            previousPrice: isPriceLower ? product.currentPrice : product.previousPrice,
            currentPrice: scraped.price,
            description: scraped.description,
            category: scraped.category,
            outOfStock: scraped.outOfStock,
            history: {
              create: { price: scraped.price },
            },
          },
        });

        // Check alerts for each user
        for (const user of product.users) {
          const alert = user.alerts.find(a => a.productId === product.id && a.isActive);
          
          if (alert && alert.targetPrice && scraped.price <= alert.targetPrice) {
            // Target price hit!
            await sendPriceDropEmail(
              user.email,
              product.title,
              product.currentPrice,
              scraped.price,
              product.url
            );

            // Optionally deactivate alert after firing once
            await prisma.alert.update({
              where: { id: alert.id },
              data: { isActive: false }
            });
          } else if (isPriceLower && !alert) {
             // Fallback: Notify on any drop if no specific alert set
             await sendPriceDropEmail(
                user.email,
                product.title,
                product.currentPrice,
                scraped.price,
                product.url
              );
          }
        }
      });
    }
  }
);
