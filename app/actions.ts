'use server'

import { prisma } from "@/prisma/prisma-client";
import { createPayment } from "@/shared/lib/create-payment";
import { getUserSession } from "@/shared/lib/get-user-session";
import { OrderStatus, Prisma, TrackStatus } from "@prisma/client";
import { hashSync } from 'bcrypt';

export async function createOrder() {
  try {
    const session = await getUserSession();
    if (!session) throw new Error('Пользователь не авторизован');

    const userId = session.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { plan: true },
    });

    if (!cartItems.length) {
      throw new Error('Корзина пуста');
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.plan.price * item.quantity,
      0
    );

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
    });

    const paymentData = await createPayment({
      amount: totalAmount,
      orderId: order.id,
      description: `Оплата заказа #${order.id}`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: paymentData.id },
    });

    await prisma.cartItem.deleteMany({ where: { userId } });

    return paymentData.confirmation.confirmation_url;
  } catch (err) {
    console.error('[createOrder]', err);
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
      active: true,
      expiresAt: {
        not: null,
        lt: new Date(),
      },
    },
    data: {
      active: false,
    },
  });
}

export async function savePlatforms(
  releaseId: string,
  platformIds: string[]
) {
  
  await prisma.releasePlatform.deleteMany({
    where: { releaseId },
  })

  await prisma.releasePlatform.createMany({
    data: platformIds.map(id => ({
      releaseId,
      platformId: id,
    })),
  })
}

export async function createRelease() {
  const session = await getUserSession()
  if (!session) throw new Error('Not authenticated')

  let artist = await prisma.artist.findFirst({ where: { userId: session.id } });

  if (!artist) {
    
    artist = await prisma.artist.create({
      data: {
        name: 'New Artist',
        userId: session.id,
      },
    });
  }

  const release = await prisma.release.create({
    data: {
      title: 'Untitled release',
      type: 'SINGLE',
      status: 'DRAFT',
      userId: session.id,
      artistId: artist.id,
    },
  })

  return release.id
}

//Удаление релиза
export async function deleteRelease(releaseId: string) {
  const session = await getUserSession()
  if (!session) throw new Error('Not authenticated')

  const release = await prisma.release.findFirst({
    where: {
      id: releaseId,
      userId: session.id,
    },
  })

  await prisma.track.deleteMany({ where: { releaseId } })
  
  if (!release) {
    throw new Error('Release not found')
  }

  await prisma.release.delete({
    where: { id: releaseId },
  })
}


//Редактирование релиза
export async function updateRelease(
  releaseId: string,
  data: { title?: string }
) {
  const session = await getUserSession()
  if (!session) throw new Error('Not authenticated')

  await prisma.release.updateMany({
    where: {
      id: releaseId,
      userId: session.id,
    },
    data,
  })
}

//Удаление треклиста
export async function deleteTrack(trackId: string) {
  const session = await getUserSession()
  if (!session) throw new Error('Not authenticated')

  const track = await prisma.track.findFirst({
    where: {
      id: trackId,
      release: {
        userId: session.id,
      },
    },
  })

  if (!track) {
    throw new Error('Track not found')
  }

  await prisma.track.delete({
    where: { id: trackId },
  })
}

// Обновление трека
export async function updateTrack(
  trackId: string,
  data: { title?: string; status?: TrackStatus }
) {
  const session = await getUserSession()
  if (!session) throw new Error("Not authenticated")

  const track = await prisma.track.update({
    where: { id: trackId },
    data,
    include: {
      release: {
        include: {
          tracks: true,
        },
      },
    },
  })


  // если это единственный трек — обновляем title релиза
  if (data.title && track.release.tracks.length === 1) {
    await prisma.release.update({
      where: { id: track.releaseId },
      data: { title: data.title },
    })
  }

  return track
}

export async function upsertTrackArtist(
  trackId: string,
  name: string
) {
  const session = await getUserSession()
  if (!session) throw new Error("Not authenticated")

  await prisma.trackArtist.deleteMany({
    where: { trackId },
  })

  await prisma.trackArtist.create({
    data: {
      trackId,
      name,
    },
  })
}


export async function upsertArtistCard(data: {
  releaseId: string
  name: string
  spotifyUrl?: string
  appleMusicUrl?: string
  socialUrl?: string
  ready: boolean
}) {
  const session = await getUserSession()
  if (!session) throw new Error("Not authenticated")

  await prisma.artistCard.upsert({
    where: {
      name_releaseId: {
        name: data.name,
        releaseId: data.releaseId,
      },
    },
    update: data,
    create: data,
  })
}

export async function saveReleaseInformation(
  releaseId: string,
  data: {
    title: string
    label: string
    genre: string
    version?: string
    artist: string
    publishDate: Date | null
  }
) {
  const session = await getUserSession()
  if (!session) throw new Error("Not authenticated")

  const release = await prisma.release.findFirst({
    where: {
      id: releaseId,
      userId: session.id,
    },
  })

  if (!release) {
    throw new Error("Release not found")
  }

  let artist = await prisma.artist.findFirst({
    where: {
      userId: session.id,
      name: data.artist,
    },
  })

  if (!artist) {
    artist = await prisma.artist.create({
      data: {
        name: data.artist,
        userId: session.id,
      },
    })
  }

  let label = await prisma.label.findFirst({
    where: {
      name: data.label,
      owners: {
        some: { id: session.id },
      },
    },
  })

  if (!label) {
    label = await prisma.label.create({
      data: {
        name: data.label,
        owners: {
          connect: { id: session.id },
        },
      },
    })
  }

  await prisma.release.update({
    where: { id: releaseId },
    data: {
      title: data.title,
      genre: data.genre,
      version: data.version || null,
      releaseDate: data.publishDate,
      artistId: artist.id,
      labelId: label.id,
    },
  })
}


export async function createBalanceTopUp(amount: number) {
  const session = await getUserSession();
  if (!session) throw new Error("Not authenticated");

  if (amount < 100) {
    throw new Error("Минимальная сумма пополнения 100₽");
  }

  const order = await prisma.order.create({
    data: {
      userId: session.id,
      status: "PENDING",
      total: amount,
      type: "BALANCE_TOPUP",
    },
  });

  const paymentData = await createPayment({
    amount,
    orderId: order.id,
    description: `Пополнение баланса #${order.id}`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentId: paymentData.id,
    },
  });

  return paymentData.confirmation.confirmation_url;
}
