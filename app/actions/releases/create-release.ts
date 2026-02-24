'use server'

import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";

export async function createRelease() {
  const session = await getUserSession();
  if (!session) throw new Error("Not authenticated");

  let artist = await prisma.artist.findFirst({
    where: { userId: session.id },
  });

  if (!artist) {
    artist = await prisma.artist.create({
      data: { name: "New Artist", userId: session.id },
    });
  }

  const release = await prisma.release.create({
    data: {
      title: "Untitled release",
      type: "SINGLE",
      status: "DRAFT",
      userId: session.id,
      artistId: artist.id,
    },
  });

  return release.id;
}