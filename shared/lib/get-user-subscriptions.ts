import { prisma } from '@/prisma/prisma-client';

export async function getUserSubscriptions(userId: string) {
  return prisma.subscription.findMany({
    where: {
      userId,
      active: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
    include: { plan: true },
    orderBy: { expiresAt: 'asc' },
  });
}

