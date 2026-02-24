'use server'

import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";

export async function registerUser(body: Prisma.UserCreateInput) {
  const user = await prisma.user.findFirst({
    where: { email: body.email },
  });

  if (user) throw new Error("Пользователь уже существует");

  await prisma.user.create({
    data: {
      fullName: body.fullName,
      email: body.email,
      password: hashSync(body.password, 10),
    },
  });
}

