import { prisma } from '@/prisma/prisma-client'
import { Container, Title } from '@/shared/components/shared'
import { PlatformGroup } from '@/shared/components/shared/platforms/PlatformGroup'
import { PlatformsFooter } from '@/shared/components/shared/platforms/PlatformsFooter'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SelectPlatformsPage({ params }: PageProps) {
  const { id: releaseId } = await params

  const platforms = await prisma.platform.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
  })

  const streaming = platforms.filter(p => p.type === 'STREAMING')
  const ugc = platforms.filter(p => p.type === 'UGC')

  return (
    <Container className="space-y-10 mt-10">
        <Title text="Выбери площадки" size="2xl" className="font-bold" />

        <PlatformGroup
          title="Стриминговые платформы"
          platforms={streaming}
        />

        <PlatformGroup
          title="UGC платформы"
          description="Данные платформы допускают только на 100% авторский контент..."
          platforms={ugc}
        />

        <PlatformsFooter releaseId={releaseId} />

    </Container>
  )
}

