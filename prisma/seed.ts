import { PrismaClient, Prisma } from '@prisma/client'
import { hashSync } from 'bcrypt'
import { prisma } from "./prisma-client";




const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

/* ----------------------------------------
   DOWN — очистка БД
-----------------------------------------*/
async function down() {
  await prisma.auditLog.deleteMany()
  await prisma.invite.deleteMany()
  await prisma.verificationCode.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.track.deleteMany()
  await prisma.release.deleteMany()
  await prisma.artist.deleteMany()
  await prisma.label.deleteMany()
  await prisma.file.deleteMany()
  await prisma.user.deleteMany()
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

  await prisma.subscription.create({
    data: {
      userId: user.id,
      plan: "PRO",
      active: true,
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

  /* ---------- FILES ---------- */
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

  await prisma.invite.create({
    data: {
      email: 'invite@label.dev',
      role: 'MODERATOR',
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  })
}






  
async function main() {
  try {
    console.log('🌱 Seeding database...')
    await down()
    await up()
    console.log('✅ Seeding completed')
  } catch (e) {
    console.error('❌ Seeding failed', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

