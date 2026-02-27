'use server'

import { prisma } from "@/prisma/prisma-client";
import { FileType } from "@prisma/client";
import { getUserSession } from "@/shared/lib/get-user-session";

export async function uploadCover(
  releaseId: string,
  url: string,
  size: number,
  mimeType: string
) {
  const session = await getUserSession();
  if (!session) throw new Error("Not authenticated");

  const release = await prisma.release.findFirst({
    where: {
      id: releaseId,
      userId: session.id,
    },
  });

  if (!release) {
    throw new Error("Release not found");
  }

  const file = await prisma.file.create({
    data: {
      type: FileType.IMAGE,
      url,
      size,
      mimeType,
      uploadedBy: session.id,
    },
  });

  await prisma.release.update({
    where: { id: releaseId },
    data: { coverId: file.id },
  });

  return file;
}