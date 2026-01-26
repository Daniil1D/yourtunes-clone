import { NextResponse } from 'next/server'
import { prisma } from '@/prisma/prisma-client'
import { getUserSession } from '@/shared/lib/get-user-session'
import path from 'path'
import fs from 'fs/promises'
import { nanoid } from 'nanoid'

export async function POST(req: Request) {
  try {
    const session = await getUserSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()

    const file = formData.get('file') as File
    const releaseId = formData.get('releaseId') as string

    if (!file || !releaseId) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const ext = file.name.split('.').pop()
    const fileName = `${nanoid()}.${ext}`

    const uploadDir = path.join(process.cwd(), 'public/uploads/audio')
    await fs.mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, fileName)
    await fs.writeFile(filePath, buffer)

    const savedFile = await prisma.file.create({
      data: {
        type: 'AUDIO',
        url: `/uploads/audio/${fileName}`,
        size: file.size,
        mimeType: file.type,
        uploadedBy: session.id,
      },
    })

    await prisma.track.create({
      data: {
        title: file.name.replace(`.${ext}`, ''),
        audioFileId: savedFile.id,
        releaseId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[UPLOAD_AUDIO]', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
