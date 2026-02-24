import { prisma } from "@/prisma/prisma-client"
import { autoPublishReleases } from "./release-auto-publish"

export async function getTopReleases(genre?: string) {
  await autoPublishReleases()

  const releases = await prisma.release.findMany({
    where: {
      status: "DISTRIBUTED",

      ...(genre && { genre }),
    },
    include: {
      cover: true,
      artist: true,
        tracks: {
            take: 1,
            select: {
                id: true,
                title: true,
                audioUrl: true,
            },
        },
    },
    orderBy: {
      playsCount: "desc",
    },
  })

  await Promise.all(
    releases.map((release, index) =>
      prisma.release.update({
        where: { id: release.id },
        data: { chartPosition: index + 1 },
      })
    )
  )

  return releases
}

