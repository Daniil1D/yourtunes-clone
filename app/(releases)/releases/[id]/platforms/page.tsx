import { Container, Title } from "@/shared/components/shared";
import { prisma } from "@/prisma/prisma-client";
import { ReleaseMainForm } from "@/shared/components/shared/platforms/release-main-form";
interface PageProps {
  params: Promise<{ id: string }>;
}
export default async function InformationReleasePage({ params }: PageProps) {
  const { id } = await params;

  const release = await prisma.release.findUnique({
    where: { id },
    include: {
      artist: true,
      platforms: {
        include: {
          platform: true,
        },
      },
    },
  });

  const allPlatforms = await prisma.platform.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  if (!release) return <div>Релиз не найден</div>;

  return (
    <Container className="mt-10 space-y-8">
      <Title text="Информация о релизе" size="xl" />

      <ReleaseMainForm
        release={release}
        platforms={allPlatforms}
        id={release.id}
      />

    </Container>
  );
}

