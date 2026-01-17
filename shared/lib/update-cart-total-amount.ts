import { prisma } from '@/prisma/prisma-client';
import { calcCartItemTotalPrice } from './calc-cart-item-total-price';

export const updateCartTotalAmount = async (userId: string) => {
  // Найти все CartItem пользователя
  const userCartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { plan: true }, // подключаем план для цены
  });

  if (!userCartItems.length) {
    return { items: [], totalAmount: 0 };
  }

  // Считаем общую сумму
  const totalAmount = userCartItems.reduce((acc, item) => {
    return acc + calcCartItemTotalPrice(item);
  }, 0);

  return { items: userCartItems, totalAmount };
};
