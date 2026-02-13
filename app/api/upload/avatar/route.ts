import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    // создаём имя файла
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${session.id}-${Date.now()}-${file.name}`;
    const uploadPath = path.join(process.cwd(), "public/uploads", fileName);

    // создаём папку если нет
    await fs.mkdir(path.join(process.cwd(), "public/uploads"), {
      recursive: true,
    });

    // сохраняем файл
    await fs.writeFile(uploadPath, buffer);

    const avatarUrl = `/uploads/${fileName}`;

    // обновляем пользователя
    await prisma.user.update({
      where: { id: session.id },
      data: {
        avatarUrl,
      },
    });

    return NextResponse.json({ avatarUrl });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
