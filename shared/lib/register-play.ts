import { prisma } from "@/prisma/prisma-client"

export async function registerPlay(releaseId: string) {
  await prisma.release.update({
    where: { id: releaseId },
    data: {
      playsCount: {
        increment: 1,
      },
    },
  })
}

