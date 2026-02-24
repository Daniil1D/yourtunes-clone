import { Container, Title } from "@/shared/components/shared";
import { ReleaseInformationForm } from "@/shared/components/shared/releaseInformationForm/release-information-form";

import { prisma } from "@/prisma/prisma-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InformationReleasePage({ params }: PageProps) {
  const { id: releaseId } = await params;

  const release = await prisma.release.findUnique({
    where: { id: releaseId },
    include: {
      tracks: {
        include: {
          artists: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return (
    <Container className="mt-10 space-y-8">
      <Title text="Информация о релизе" size="xl" />

      <ReleaseInformationForm
        releaseId={releaseId}
        release={release}
      />
    </Container>
  );
}

