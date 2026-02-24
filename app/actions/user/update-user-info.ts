'use server'

import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  const session = await getUserSession();
  if (!session) throw new Error("Not authenticated");

  const existing = await prisma.user.findUnique({
    where: { id: session.id },
  });

  await prisma.user.update({
    where: { id: session.id },
    data: {
      fullName: body.fullName,
      email: body.email,
      password: body.password
        ? hashSync(body.password as string, 10)
        : existing?.password,
    },
  });
}