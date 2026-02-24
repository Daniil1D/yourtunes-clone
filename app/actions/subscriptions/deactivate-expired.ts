'use server'

import { prisma } from "@/prisma/prisma-client";

export async function deactivateExpiredSubscriptions() {
  await prisma.subscription.updateMany({
    where: {
      active: true,
      expiresAt: {
        not: null,
        lt: new Date(),
      },
    },
    data: { active: false },
  });
}