import { prisma } from '@/prisma/prisma-client'
import { Container, Title } from '@/shared/components/shared'
import { PlatformGroup } from '@/shared/components/shared/platforms/PlatformGroup'
import { PlatformsFooter } from '@/shared/components/shared/platforms/PlatformsFooter'
import { InitPlatforms } from '@/shared/components/shared/platforms/InitPlatforms'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditReleasePage({ params }: PageProps) {
  const { id: releaseId } = await params

  const platforms = await prisma.platform.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
  })

  const selected = await prisma.releasePlatform.findMany({
    where: { releaseId },
    select: { platformId: true },
  })

  const selectedIds = selected.map(p => p.platformId)

  const streaming = platforms.filter(p => p.type === 'STREAMING')
  const ugc = platforms.filter(p => p.type === 'UGC')

  return (
    <Container className="space-y-10 mt-10">
      <Title text="Редактирование площадок" size="2xl" />

      <InitPlatforms selectedIds={selectedIds} />

      <PlatformGroup
        title="Стриминговые платформы"
        platforms={streaming}
      />

      <PlatformGroup
        title="UGC платформы"
        description="Допускается только 100% авторский контент"
        platforms={ugc}
      />

      <PlatformsFooter releaseId={releaseId} />
    </Container>
  )
}
