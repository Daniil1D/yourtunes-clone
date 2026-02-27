'use server'

import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";

export async function updateTrack(
  trackId: string,
  data: {
    title: string;
    artistName: string;
  }
) {
  const session = await getUserSession();
  if (!session) throw new Error("Not authenticated");

  const existingTrack = await prisma.track.findFirst({
    where: {
      id: trackId,
      release: {
        userId: session.id,
      },
    },
    include: {
      artists: true,
      release: {
        include: { tracks: true },
      },
    },
  });

  if (!existingTrack) {
    throw new Error("Track not found");
  }

  const updatedTrack = await prisma.track.update({
    where: { id: trackId },
    data: {
      title: data.title,

      artists: {
        deleteMany: {},
        create: [
          {
            name: data.artistName,
          },
        ],
      },
    },
  });

  if (existingTrack.release.tracks.length === 1) {
    await prisma.release.update({
      where: { id: existingTrack.releaseId },
      data: {
        title: data.title,
      },
    });
  }

  return updatedTrack;
}