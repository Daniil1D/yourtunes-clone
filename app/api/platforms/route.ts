import { prisma } from "@/prisma/prisma-client"

export async function GET() {
  const platforms = await prisma.platform.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
  })

  return Response.json(platforms)
}
