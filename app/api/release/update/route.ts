import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

     const { releaseId, title, artistName, platformIds } = body;

    if (!releaseId) {
      return NextResponse.json(
        { error: "Нет releaseId" },
        { status: 400 }
      );
    }

    const updated = await prisma.release.update({
      where: { id: releaseId },
      data: {
        title,

        // ✅ обновляем имя артиста через relation
        artist: {
          update: {
            name: artistName,
          },
        },
        platforms: {
          deleteMany: {},

          create: platformIds.map((platformId: string) => ({
            platformId,
          })),
        },
      },
       
      include: {
        artist: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Release update error:", error);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
