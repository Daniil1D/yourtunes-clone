import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.event !== "payment.succeeded") {
      return NextResponse.json({ ok: true });
    }

    const payment = body.object;

    // ищем заказ по paymentId
    const order = await prisma.order.findFirst({
      where: { paymentId: payment.id },
      include: { items: true },
    });

    if (!order) {
      console.log("Order not found for payment:", payment.id);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "PAID") {
      return NextResponse.json({ ok: true });
    }

    await prisma.$transaction(async (tx) => {
      // Пополнение баланса
      if (order.type === "BALANCE_TOPUP") {
        console.log("💰 Balance top up:", order.total);

        // увеличиваем баланс
        await tx.user.update({
          where: { id: order.userId },
          data: {
            balance: {
              increment: order.total,
            },
          },
        });

        // ДОБАВЛЯЕМ транзакцию в историю
        await tx.transaction.create({
          data: {
            userId: order.userId,
            amount: order.total,
            type: "TOPUP",
          },
        });
      }

      // Подписка
      if (order.type === "SUBSCRIPTION") {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        for (const item of order.items) {
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
              startedAt: new Date(),
              expiresAt,
              orderId: order.id,
            },
          });
        }

        await tx.cartItem.deleteMany({
          where: { userId: order.userId },
        });
      }

      // Заказ отмечаем как оплаченный
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
        },
      });
    });

    console.log("YOOKASSA WEBHOOK OK:", order.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
