'use server'

import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";

export async function upsertArtistCard(data: {
  releaseId: string;
  name: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  socialUrl?: string;
  ready: boolean;
}) {
  const session = await getUserSession();
  if (!session) throw new Error("Not authenticated");

  const release = await prisma.release.findFirst({
    where: {
      id: data.releaseId,
      userId: session.id,
    },
  });

  if (!release) {
    throw new Error("Release not found");
  }

  const artistCard = await prisma.artistCard.upsert({
    where: {
      name_releaseId: {
        name: data.name,
        releaseId: data.releaseId,
      },
    },
    update: {
      spotifyUrl: data.spotifyUrl,
      appleMusicUrl: data.appleMusicUrl,
      socialUrl: data.socialUrl,
      ready: data.ready,
    },
    create: {
      releaseId: data.releaseId,
      name: data.name,
      spotifyUrl: data.spotifyUrl,
      appleMusicUrl: data.appleMusicUrl,
      socialUrl: data.socialUrl,
      ready: data.ready,
    },
  });

  return artistCard;
}