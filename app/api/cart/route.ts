import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/shared/lib/get-user-session";

export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ items: [], totalAmount: 0 });
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.id },
    include: { plan: true },
  });

  const totalAmount = items.reduce(
    (sum, item) => sum + item.plan.price * item.quantity,
    0
  );

  return NextResponse.json({ items, totalAmount });
}

export async function POST(req: NextRequest) {
  const session = await getUserSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { planId, quantity = 1 } = await req.json();

  const existing = await prisma.cartItem.findFirst({
    where: {
      userId: session.id,
      planId,
    },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        userId: session.id,
        planId,
        quantity,
      },
    });
  }

  return GET();
}

