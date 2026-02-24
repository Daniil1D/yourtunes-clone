'use server'

import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";

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

      status: "DISTRIBUTED",
    },
  })
}

