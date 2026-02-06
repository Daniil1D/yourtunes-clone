import { prisma } from "@/prisma/prisma-client";
import { Container, Title } from "@/shared/components/shared";
import { TracklistClient } from "@/shared/components/shared/tracks/TracklistClient";

interface PageProps {
  params: { id: string };
}

export default async function TracklistPage({ params }: PageProps) {
  const { id: releaseId } = await params; 

  // Получаем треки с сервера
  const tracks = await prisma.track.findMany({
    where: { releaseId },
    include: {
      artists: true,
      feats: true,
      audioFile: true,
    },
  });

  return (
    <Container className="space-y-10 mt-10">
      <Title text="Треклист" size="2xl" />

      <TracklistClient tracks={tracks} />
    </Container>
  );
}
