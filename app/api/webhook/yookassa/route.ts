import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.event !== "payment.succeeded") {
    return NextResponse.json({ ok: true });
  }

  const payment = body.object;
  const order = await prisma.order.findFirst({
    where: { paymentId: payment.id },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "No order_id" }, { status: 400 });
  }

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status === "PAID") {
    return NextResponse.json({ ok: true });
  }

  const now = new Date();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.$transaction(async (tx) => {
    if (order.type === "SUBSCRIPTION") {
      for (const item of order.items) {
        console.log("Создана/обновлена подписка:", item.planId, expiresAt);

        await tx.subscription.upsert({
          where: {
            userId_planId_active: {
              userId: order.userId,
              planId: item.planId,
              active: true,
            },
          },
          update: {
            expiresAt,
          },
          create: {
            userId: order.userId,
            planId: item.planId,
            active: true,
            startedAt: now,
            expiresAt,
            orderId: order.id,
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: { userId: order.userId },
      });
    }

    if (order.type === "BALANCE_TOPUP") {
      console.log("Пополнение баланса на сумму:", order.total);

      await tx.user.update({
        where: { id: order.userId },
        data: {
          balance: {
            increment: order.total,
          },
        },
      });
    }

    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        paymentId: payment.id,
      },
    });
  });

  console.log("YOOKASSA WEBHOOK OK", { order });

  return NextResponse.json({ ok: true });
}
