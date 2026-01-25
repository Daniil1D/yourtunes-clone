import { prisma } from '@/prisma/prisma-client'
import { getUserSession } from '@/shared/lib/get-user-session'
import { ReleasesHeader } from '@/shared/components/shared/myReleases/ReleasesHeader'
import { ReleaseCard } from '@/shared/components/shared/myReleases/ReleaseCard'
import { Container } from '@/shared/components/shared'

export default async function ReleasesPage() {
  const session = await getUserSession()
  if (!session) return null

  const releases = await prisma.release.findMany({
    where: {
      userId: session.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <Container className="space-y-10 mt-10">
      <ReleasesHeader />

      <div className="space-y-4">
        {releases.map(release => (
          <ReleaseCard
            key={release.id}
            id={release.id}
            title={release.title}
            status={
              release.status === 'DRAFT'
                ? 'Черновик'
                : 'Опубликован'
            }
          />
        ))}
      </div>
    </Container>
  )
}
