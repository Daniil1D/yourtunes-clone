import { prisma } from "@/prisma/prisma-client"
import { Plans } from "@/shared/components/shared"

export async function PlansServer() {
  const plans = await prisma.plan.findMany({
    include: { features: true },
    orderBy: { price: "asc" },
  })

  return <Plans plans={plans} />
}
