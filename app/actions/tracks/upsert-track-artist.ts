'use server'

import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";

export async function upsertTrackArtist(
  trackId: string,
  name: string
) {
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

  await prisma.trackArtist.deleteMany({
    where: { trackId },
  });

  await prisma.trackArtist.create({
    data: {
      trackId,
      name,
    },
  });

  return true;
}