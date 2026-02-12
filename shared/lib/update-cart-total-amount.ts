import { prisma } from '@/prisma/prisma-client';
import { calcCartItemTotalPrice } from './calc-cart-item-total-price';

export const updateCartTotalAmount = async (userId: string) => {

  const userCartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { plan: true }, 
  });

  if (!userCartItems.length) {
    return { items: [], totalAmount: 0 };
  }

  const totalAmount = userCartItems.reduce((acc, item) => {
    return acc + calcCartItemTotalPrice(item);
  }, 0);

  return { items: userCartItems, totalAmount };
};
