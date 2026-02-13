import { Suspense } from "react";
import { Container } from "@/shared/components/shared";
import { ReleaseDetailsSkeleton } from "@/shared/components/shared/skeleton/release-details-skeleton";
import { ReleaseDetailsServer } from "./_components/release-details-server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReleaseDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Container className="space-y-6 mt-10">

      <Suspense fallback={<ReleaseDetailsSkeleton />}>
        <ReleaseDetailsServer releaseId={id} />
      </Suspense>
    </Container>
  );
}
