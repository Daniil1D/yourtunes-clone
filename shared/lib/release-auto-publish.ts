import { prisma } from "@/prisma/prisma-client"

export async function autoPublishReleases() {
  const now = new Date()

  await prisma.release.updateMany({
    where: {
      status: "SCHEDULED",
      releaseDate: {
        lte: now,
      },
    },
    data: {
      status: "DISTRIBUTED",
      trending: true,
    },
  })
}

