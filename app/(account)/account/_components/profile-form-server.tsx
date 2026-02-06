import { prisma } from "@/prisma/prisma-client"
import { ProfileForm } from "@/shared/components/shared"
import { getUserSession } from "@/shared/lib/get-user-session"
import { redirect } from "next/navigation"

export async function ProfileFormServer() {
  const session = await getUserSession()
  if (!session) redirect("/not-auth")

  const user = await prisma.user.findFirst({
    where: { id: String(session.id) },
  })

  if (!user) redirect("/not-auth")

  return <ProfileForm data={user} />
}
    