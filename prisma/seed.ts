import { hashSync } from 'bcrypt'
import { prisma } from "./prisma-client";


const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min



async function down() {
  await prisma.orderItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.planFeature.deleteMany();
  await prisma.verificationCode.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.invite.deleteMany();
  await prisma.track.deleteMany();
  await prisma.release.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.label.deleteMany();
  await prisma.file.deleteMany();
  await prisma.order.deleteMany();
  await prisma.platform.deleteMany();
  await prisma.user.deleteMany();
  await prisma.plan.deleteMany();
}

async function up() {

  const admin = await prisma.user.create({
    data: {
      email: 'admin@yourtunes.dev',
      fullName: 'Admin',
      password: hashSync('admin123', 10),
      role: 'ADMIN',
      verified: new Date(),
    },
  })

  const user = await prisma.user.create({
    data: {
      email: 'user@yourtunes.dev',
      fullName: 'Artist User',
      password: hashSync('user123', 10),
      role: 'USER',
      verified: new Date(),
    },
  })

  await prisma.plan.create({
    data: {
      id: 'PRO',
      title: 'PRO',
      description: 'Для независимых артистов',
      price: 250,
      oldPrice: 350,
      period: 'month',
      features: {
        create: [
          { text: 'До 3 релизов' },
          { text: 'Мин. сумма вывода 2000₽' },
          { text: 'Вывод ежеквартально' },
        ],
      },
    },
  })

  await prisma.plan.create({
    data: {
      id: 'LABEL',
      title: 'LABEL',
      description: 'Для лейблов и продвинутых артистов',
      price: 450,
      oldPrice: 650,
      period: 'month',
      highlighted: true,
      features: {
        create: [
          { text: 'До 5 релизов' },
          { text: 'Мин. сумма вывода 1000₽' },
          { text: 'Вывод раз в месяц' },
          { text: 'Подача в плейлисты' },
          { text: 'Возможность указать свой лейбл' },
        ],
      },
    },
  })
  

  const label = await prisma.label.create({
    data: {
      name: 'YourTunes Records',
      owners: {
        connect: [{ id: admin.id }],
      },
    },
  })

  const artist = await prisma.artist.create({
    data: {
      name: 'Demo Artist',
      userId: user.id,
    },
  })

  const coverFile = await prisma.file.create({
    data: {
      type: 'IMAGE',
      url: 'https://cdn.yourtunes.dev/covers/demo.jpg',
      size: 120000,
      mimeType: 'image/jpeg',
      uploadedBy: user.id,
    },
  })

  const release = await prisma.release.create({
    data: {
      title: 'My First Release',
      type: 'EP',
      status: 'APPROVED',
      releaseDate: new Date(),
      userId: user.id,
      artistId: artist.id,
      labelId: label.id,
      coverId: coverFile.id,
    },
  })

  for (let i = 1; i <= 3; i++) {
    const audioFile = await prisma.file.create({
      data: {
        type: 'AUDIO',
        url: `https://cdn.yourtunes.dev/audio/track-${i}.mp3`,
        size: randomInt(3_000_000, 8_000_000),
        mimeType: 'audio/mpeg',
        uploadedBy: user.id,
      },
    })

    await prisma.track.create({
      data: {
        title: `Track ${i}`,
        duration: randomInt(120, 300),
        status: 'READY',
        releaseId: release.id,
        audioFileId: audioFile.id,
      },
    })
  }

  await prisma.verificationCode.create({
    data: {
      userId: user.id,
      code: '123456',
    },
  })

  await prisma.auditLog.create({
    data: {
      action: 'CREATE_RELEASE',
      entity: 'Release',
      entityId: release.id,
      userId: user.id,
    },
  })

  await prisma.platform.createMany({
    data: [

      { name: 'Apple Music', type: 'STREAMING', logo: "/platforms/apple-music.svg" },
      { name: 'Spotify', type: 'STREAMING', logo: "/platforms/spotify.svg" },
      { name: 'TIDAL', type: 'STREAMING', logo: "/platforms/tidal.svg" },
      { name: 'VK Music', type: 'STREAMING', logo: "/platforms/vk-music.svg" },
      { name: 'YouTube Music', type: 'STREAMING', logo: "/platforms/youtube-music.svg" },
      { name: 'Zvuk', type: 'STREAMING', logo: "/platforms/apple-music.svg" },
      { name: 'Yandex.Music', type: 'STREAMING', logo: "/platforms/yandex-music.svg" },
      { name: 'Amazon', type: 'STREAMING', logo: "/platforms/amazon.svg" },
      { name: 'Anghami', type: 'STREAMING', logo: "/platforms/apple-music.svg" },
      { name: 'Deezer', type: 'STREAMING', logo: "/platforms/apple-music.svg" },
      { name: 'Pandora', type: 'STREAMING', logo: "/platforms/apple-music.svg" },
      { name: 'Qobuz', type: 'STREAMING', logo: "/platforms/apple-music.svg" },
      { name: 'Shazam', type: 'STREAMING', logo: "/platforms/shazam.svg" },


      { name: 'Facebook / Instagram', type: 'UGC', logo: "/platforms/apple-music.svg" },
      { name: 'SoundCloud', type: 'UGC', logo: "/platforms/soundcloud.svg" },
      { name: 'TikTok', type: 'UGC', logo: "/platforms/tiktok.svg" },
      { name: 'YouTube Content ID', type: 'UGC', logo: "/platforms/youtube-music.svg" },
      { name: 'MusixMatch', type: 'UGC', logo: "/platforms/apple-music.svg" },
    ],
  })


  await prisma.invite.create({
    data: {
      email: 'invite@label.dev',
      role: 'MODERATOR',
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  })

  await prisma.cartItem.createMany({
    data: [
      { userId: user.id, planId: 'PRO', quantity: 1 },
    ],
  });

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: 'PAID',
      total: 700,
      items: {
        create: [
          { planId: 'PRO', price: 250, quantity: 1 },
          { planId: 'LABEL', price: 450, quantity: 1 },
        ],
      },
    },
  });

  await prisma.subscription.createMany({
    data: [
      {
        userId: user.id,
        planId: 'PRO',
        active: true,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        orderId: order.id,
      },
      {
        userId: user.id,
        planId: 'LABEL',
        active: true,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        orderId: order.id,
      },
    ],
  });
  
}

async function main() {
  try {
    console.log('Seeding database...')
    await down()
    await up()
    console.log('Seeding completed')
  } catch (e) {
    console.error('Seeding failed', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

