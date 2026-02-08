import { Container, Title } from "@/shared/components/shared";
import { ReleaseInformationForm } from "@/shared/components/shared/releaseInformationForm/release-information-form";

import { prisma } from "@/prisma/prisma-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InformationReleasePage({ params }: PageProps) {
  const { id: releaseId } = await params;

  const firstTrack = await prisma.track.findFirst({
    where: {
      releaseId,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      title: true,
      artists: {
        select: {
          name: true,
        },
        take: 1,
      },
    },
  });

  return (
    <Container className="mt-10 space-y-8">
      <Title text="Информация о релизе" size="xl" />

      <ReleaseInformationForm
        releaseId={releaseId}
        defaultTitle={firstTrack?.title || ""}
        defaultArtist={firstTrack?.artists?.[0]?.name || ""}
      />
    </Container>
  );
}
