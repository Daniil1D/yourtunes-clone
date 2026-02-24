'use server'

import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";

export async function deleteRelease(releaseId: string) {
  const session = await getUserSession();
  if (!session) throw new Error("Not authenticated");

  await prisma.track.deleteMany({ where: { releaseId } });

  await prisma.release.deleteMany({
    where: { id: releaseId, userId: session.id },
  });
}