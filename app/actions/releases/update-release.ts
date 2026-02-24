'use server'

import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";

export async function updateRelease(
  releaseId: string,
  data: { title?: string }
) {
  const session = await getUserSession();
  if (!session) throw new Error("Not authenticated");

  await prisma.release.updateMany({
    where: { id: releaseId, userId: session.id },
    data,
  });
}