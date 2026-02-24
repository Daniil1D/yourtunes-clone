import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { NextResponse } from "next/server";
import { retrieveKnowledge } from "@/shared/lib/retrieveKnowledge";
import { openai } from "@/shared/lib/openai";

export async function getAIResponse(message: string) {
  const relevantKnowledge = retrieveKnowledge(message);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
        Ты служба поддержки сервиса YourTunes.
        Используй ТОЛЬКО информацию ниже.
        Если ответа нет в базе знаний — скажи, что уточнишь.

        База знаний:
        ${relevantKnowledge}
        `,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return completion.choices[0].message.content ?? "";
}

export async function POST(req: Request) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const text = body.text;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    // Находим чат пользователя или создаём новый
    let chat = await prisma.supportChat.findFirst({
      where: { userId: session.id },
    });

    if (!chat) {
      chat = await prisma.supportChat.create({
        data: {
          userId: session.id,
        },
      });
    }

    // Сохраняем сообщение пользователя
    const userMessage = await prisma.supportMessage.create({
      data: {
        chatId: chat.id,
        text,
        role: "USER",
      },
    });

    const botReplyText = await getAIResponse(text);

    const botMessage = await prisma.supportMessage.create({
      data: {
        chatId: chat.id,
        text: botReplyText,
        role: "BOT",
      },
    });

    // Возвращаем сообщения
    return NextResponse.json({
      userMessage,
      botMessage,
    });
  } catch (error) {
    console.error("Support send error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

