'use server'

import { prisma } from "@/prisma/prisma-client";

export async function savePlatforms(
  releaseId: string,
  platformIds: string[]
) {
  await prisma.releasePlatform.deleteMany({
    where: { releaseId },
  });

  await prisma.releasePlatform.createMany({
    data: platformIds.map(id => ({
      releaseId,
      platformId: id,
    })),
  });
}