import { NextResponse } from 'next/server'
import { prisma } from '@/prisma/prisma-client'
import { getUserSession } from '@/shared/lib/get-user-session'

export async function POST(req: Request) {
  const session = await getUserSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { releaseId, key, filename, size, mimeType } = await req.json()

  const file = await prisma.file.create({
    data: {
      type: 'AUDIO',
      url: key,
      size,
      mimeType,
      uploadedBy: session.id,
    },
  })

  await prisma.track.create({
    data: {
      title: filename,
      releaseId,
      audioFileId: file.id,
    },
  })

  return NextResponse.json({ success: true })
}
