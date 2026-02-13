import { Suspense } from "react";
import { Container, Title } from "@/shared/components/shared";
import { PlatformsSkeleton } from "@/shared/components/shared/skeleton/platforms-skeleton";
import { EditPlatformsServer } from "../_components/edit-platforms-server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditReleasePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Container className="space-y-10 mt-10">

      <Title text="Редактирование площадок" size="2xl" />

      <Suspense fallback={<PlatformsSkeleton />}>
        <EditPlatformsServer releaseId={id} />
      </Suspense>
    </Container>
  );
}
