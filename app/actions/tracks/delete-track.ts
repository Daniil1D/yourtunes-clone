'use server'

import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";

export async function deleteTrack(trackId: string) {
  const session = await getUserSession();
  if (!session) throw new Error("Not authenticated");

  const track = await prisma.track.findFirst({
    where: {
      id: trackId,
      release: {
        userId: session.id,
      },
    },
  });

  if (!track) {
    throw new Error("Track not found");
  }

  await prisma.track.delete({
    where: { id: trackId },
  });

  return true;
}