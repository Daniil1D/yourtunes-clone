import { registerPlay } from "@/shared/lib/register-play"

export async function POST(req: Request) {
  const { releaseId } = await req.json()

  if (!releaseId) {
    return new Response("No releaseId", { status: 400 })
  }

  await registerPlay(releaseId)

  return Response.json({ ok: true })
}

