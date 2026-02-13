import { Suspense } from "react";
import { Container, Title } from "@/shared/components/shared";
import { PlatformsSkeleton } from "@/shared/components/shared/skeleton/platforms-skeleton";
import { SelectPlatformsServer } from "../_components/select-platforms-server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SelectPlatformsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Container className="space-y-10 mt-10">

      <Title text="Выбери площадки" size="2xl" className="font-bold" />

      <Suspense fallback={<PlatformsSkeleton />}>
        <SelectPlatformsServer releaseId={id} />
      </Suspense>
    </Container>
  );
}
