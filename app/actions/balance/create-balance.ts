'use server'

import { prisma } from "@/prisma/prisma-client";
import { createPayment } from "@/shared/lib/create-payment";
import { getUserSession } from "@/shared/lib/get-user-session";

export async function createBalanceTopUp(amount: number) {
  const session = await getUserSession();
  if (!session) throw new Error("Not authenticated");

  if (amount < 100) throw new Error("Минимум 100₽");

  const order = await prisma.order.create({
    data: {
      userId: session.id,
      status: "PENDING",
      total: amount,
      type: "BALANCE_TOPUP",
    },
  });

  const payment = await createPayment({
    amount,
    orderId: order.id,
    description: `Пополнение #${order.id}`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentId: payment.id },
  });

  return payment.confirmation.confirmation_url;
}