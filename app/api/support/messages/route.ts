import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { NextResponse } from "next/server";


export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getUserSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Находим чат пользователя
    const chat = await prisma.supportChat.findFirst({
      where: {
        userId: session.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    // Если чата нет — возвращаем пустой массив
    if (!chat) {
      return NextResponse.json({ messages: [] });
    }

    // Возвращаем историю сообщений
    return NextResponse.json({
      messages: chat.messages,
    });
  } catch (error) {
    console.error("Support messages error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
