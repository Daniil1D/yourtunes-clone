'use server'

import { prisma } from "@/prisma/prisma-client";
import { CheckoutFormValues } from "@/shared/contants";
import { createPayment } from "@/shared/lib/create-payment";
import { getUserSession } from "@/shared/lib/get-user-session";
import { OrderStatus, Prisma } from "@prisma/client";
import { hashSync } from 'bcrypt';

export async function createOrder(data: CheckoutFormValues) {
  try {
    // Получаем текущего пользователя
    const session = await getUserSession();
    if (!session) throw new Error('Пользователь не авторизован');

    const userId = session.id;

    // Получаем корзину пользователя (CartItem)
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { plan: true },
    });

    if (!cartItems.length) {
      throw new Error('Корзина пуста');
    }

    // Считаем общую сумму
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.plan.price * item.quantity,
      0
    );

    // Создаем заказ
    const order = await prisma.order.create({
      data: {
        userId,
        status: OrderStatus.PENDING,
        total: totalAmount,
        items: {
          create: cartItems.map(item => ({
            planId: item.planId,
            price: item.plan.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Создаем оплату через ЮKassa
    const paymentData = await createPayment({
      amount: totalAmount,
      orderId: order.id,
      description: `Оплата заказа #${order.id}`,
    });

    if (!paymentData) throw new Error('Не удалось создать оплату');

    // Обновляем заказ с ID оплаты
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: paymentData.id },
    });

    // Очищаем корзину пользователя
    await prisma.cartItem.deleteMany({ where: { userId } });

    // Возвращаем ссылку на оплату
    return paymentData.confirmation.confirmation_url;

  } catch (err) {
    console.error('[createOrder] Ошибка', err);
    throw err;
  }
}

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error('Пользователь не найден');
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: String(currentUser.id),
      },
    });

    await prisma.user.update({
      where: {
        id: String(currentUser.id),
      },
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password ? hashSync(body.password as string, 10) : findUser?.password,
      },
    });
  } catch (err) {
    console.log('Error [UPDATE_USER]', err);
    throw err;
  }
}

export async function registerUser(body: Prisma.UserCreateInput) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user) {
      throw new Error('Пользователь уже существует');
    }

    await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: hashSync(body.password, 10),
      },
    });

  } catch (err) {
    console.log('Error [CREATE_USER]', err);
    throw err;
  }
}

export async function deactivateExpiredSubscriptions() {
  await prisma.subscription.updateMany({
    where: {
      expiresAt: { lt: new Date() },
      active: true,
    },
    data: {
      active: false,
    },
  });
}
