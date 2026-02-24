'use server'

import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";

export async function withdrawBalance(amount: number) {
  const session = await getUserSession();
  if (!session) throw new Error("Not authenticated");

  if (amount < 100) throw new Error("Минимум 100₽");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });

  if (!user || user.balance < amount)
    throw new Error("Недостаточно средств");

  await prisma.$transaction(async tx => {
    await tx.user.update({
      where: { id: session.id },
      data: { balance: { decrement: amount } },
    });

    await tx.transaction.create({
      data: {
        userId: session.id,
        amount,
        type: "WITHDRAW",
      },
    });
  });

  return true;
}