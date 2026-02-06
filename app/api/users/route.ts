import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/shared/contants/auth-options";

export async function GET() {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
}
// export async function GET(req: NextRequest) {
//   const session = await getServerSession(authOptions);

//   if (!session?.user) {
//     return NextResponse.json({ message: "Вы не авторизованы" }, { status: 401 });
//   }

//   return NextResponse.json({ user: session.user });
// }

export async function POST(req: NextRequest) {
    const data = await req.json();

    const user = await prisma.user.create({
        data
    })

    return NextResponse.json(user);
   
}