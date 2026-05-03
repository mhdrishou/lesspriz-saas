"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function logDonationClick(tier: string) {
  const user = await currentUser();
  
  await prisma.donationClick.create({
    data: {
      tier,
      userId: user?.id ? (await prisma.user.findUnique({ where: { clerkId: user.id } }))?.id : null,
    },
  });
}
