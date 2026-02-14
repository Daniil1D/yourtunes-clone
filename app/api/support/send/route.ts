import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { NextResponse } from "next/server";

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

    // Популярные вопросы и ответы
    const faq = [
      {
        questions: [
          "как изменить пароль",
          "как поменять пароль",
          "сменить пароль",
          "изменить пароль",
          "поменять пароль",
          "пароль поменять",
        ],
        answer: `Чтобы изменить пароль нужно:
          • Зайти на страницу «Профиль»
          • Нажать кнопку «Редактировать»
          • Изменить пароль
          • Нажать «Сохранить»`,
      },

      {
        questions: [
          "как пополнить баланс",
          "пополнить баланс",
          "как закинуть деньги",
          "как оплатить",
        ],
        answer: "Баланс пополняется через страницу Баланс.",
      },

      {
        questions: [
          "как выйти из аккаунта",
          "выйти",
          "разлогиниться",
          "выйти из профиля",
        ],
        answer:
          "Чтобы выйти, откройте профиль → Редактировать → «Выйти».",
      },

      {
        questions: [
          "что дает подписка pro",
          "что такое pro",
          "подписка pro",
          "зачем нужна pro",
        ],
        answer: `Подписка PRO — 250₽/мес
          • До 3 релизов
          • Мин. сумма вывода 2000₽
          • Вывод ежеквартально`,
      },

      {
        questions: [
          "как связаться с поддержкой",
          "поддержка",
          "саппорт",
          "помогите",
          "связаться",
        ],
        answer:
          "Вы уже пишете в поддержку 🙂 Мы отвечаем в течение нескольких часов.",
      },
    ];


    // Автоответ бота
    const normalized = text.toLowerCase().trim();

    const found = faq.find((item) =>
      item.questions.some((q) => normalized.includes(q))
    );

    const botReplyText = found
      ? found.answer
      : "Здравствуйте! Мы получили ваше сообщение. Поддержка скоро ответит 🙌";

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
