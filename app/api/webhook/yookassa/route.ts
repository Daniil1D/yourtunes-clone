import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.event !== 'payment.succeeded') {
    return NextResponse.json({ ok: true });
  }

  const payment = body.object;
  const orderId = payment.metadata?.order_id;

  if (!orderId) {
    return NextResponse.json({ error: 'No order_id' }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  // 🔒 Защита от повторных webhook'ов
  if (order.status === 'PAID') {
    return NextResponse.json({ ok: true });
  }

  const now = new Date();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {

      console.log('Создана/обновлена подписка:', item.planId, expiresAt);

      await tx.subscription.upsert({
        where: {
          userId_planId_active: {
            userId: order.userId,
            planId: item.planId,
            active: true,
          },
        },
        update: {
          expiresAt, // продление если уже есть
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

    await tx.order.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
        paymentId: payment.id,
      },
    });

    await tx.cartItem.deleteMany({
      where: { userId: order.userId },
    });
  });

  console.log('YOOKASSA WEBHOOK OK', { orderId });

  return NextResponse.json({ ok: true });
}
