import { prisma } from '@/prisma/prisma-client';

export const findOrCreateCart = async (userId: string) => {
  let cart = await prisma.cartItem.findFirst({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cartItem.create({
      data: {
        userId,
        planId: 'PRO', // создаем с дефолтным планом или можно пустой
      },
    });
  }

  return cart;
};
