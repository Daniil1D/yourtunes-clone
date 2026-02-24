'use server'

import { prisma } from "@/prisma/prisma-client";
import { createPayment } from "@/shared/lib/create-payment";
import { getUserSession } from "@/shared/lib/get-user-session";
import { OrderStatus } from "@prisma/client";

export async function createOrder() {
  const session = await getUserSession();
  if (!session) throw new Error("Not authenticated");

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.id },
    include: { plan: true },
  });

  if (!cartItems.length) throw new Error("Корзина пуста");

  const total = cartItems.reduce(
    (sum, item) => sum + item.plan.price * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId: session.id,
      status: OrderStatus.PENDING,
      total,
      items: {
        create: cartItems.map(item => ({
          planId: item.planId,
          price: item.plan.price,
          quantity: item.quantity,
        })),
      },
    },
  });

  const payment = await createPayment({
    amount: total,
    orderId: order.id,
    description: `Оплата заказа #${order.id}`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentId: payment.id },
  });

  await prisma.cartItem.deleteMany({
    where: { userId: session.id },
  });

  return payment.confirmation.confirmation_url;
}