import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { quantity } = (await req.json()) as { quantity: number };

    await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });

    const updatedCart = await updateCartTotalAmount(session.id);

    return NextResponse.json(updatedCart);
  } catch (e) {
    console.log('[CART_PATCH]', e);
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.cartItem.delete({
      where: { id },
    });

    const updatedCart = await updateCartTotalAmount(session.id);

    return NextResponse.json(updatedCart);
  } catch (e) {
    console.log('[CART_DELETE]', e);
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

