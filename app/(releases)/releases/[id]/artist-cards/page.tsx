import { prisma } from "@/prisma/prisma-client"
import { Container, Title } from "@/shared/components/shared"
import { ArtistCardsClient } from "./_components/ArtistCardsClient"

interface Props {
  params: { id: string }
}

export default async function ArtistCardsPage({ params }: Props) {
  const releaseId = params.id

  const tracks = await prisma.track.findMany({
    where: { releaseId },
    include: {
      artists: true,
      feats: true,
    },
  })

  const artistNames = Array.from(
    new Set([
      ...tracks.flatMap(t => t.artists.map(a => a.name)),
      ...tracks.flatMap(t => t.feats.map(f => f.name)),
    ])
  )

  const cards = await prisma.artistCard.findMany({
    where: { releaseId },
  })

  return (
    <Container className="space-y-10 mt-10">
      <Title
        text="Укажите карты артистов"
        size="2xl"
      />

      <ArtistCardsClient
        releaseId={releaseId}
        artistNames={artistNames}
        cards={cards}
      />
    </Container>
  )
}
